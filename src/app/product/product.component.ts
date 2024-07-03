import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../service/card.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  showTable: string | null = null;
  setErrors: any = {};
  addProductForm: FormGroup;
  allProducts: any;
  updateProductForm: FormGroup;
  isUpdateSubmitted = false;

  @Input() products: any[] = [];
  @Output() productUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private details: FormBuilder,
    private cardService: CardService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
    this.addProductForm = this.details.group({
      p_name: ['', Validators.required],
      p_des: ['', Validators.required],
      p_price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });

    this.updateProductForm = this.details.group({
      id: [''],
      p_name: ['', Validators.required],
      p_des: ['', Validators.required],
      p_price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  ngOnInit(): void {
    this.getProductData();
    this.activatedRouter.params.subscribe(params => {
      const productType = params['product'];
      switch (productType) {
        case 'all':
        case 'edit':
          this.showTable = productType;
          break;
        default:
          this.showTable = 'all';
          break;
      }
    });

    this.cardService.getProduct().subscribe({
      next: (data) => {
        this.allProducts = data.result;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  toggleTable(tableType: string) {
    this.router.navigate(['/product', tableType]);
  }

  onAddSubmit(): void {
    this.setErrors = {};
    const formData = new FormData();
    formData.append('p_name', this.addProductForm.get('p_name')?.value);
    formData.append('p_des', this.addProductForm.get('p_des')?.value);
    formData.append('p_price', this.addProductForm.get('p_price')?.value);

    this.cardService.addProduct(formData).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Product added successfully');
          this.addProductForm.reset();
          this.setErrors = {};
          this.getProductData();
        }
      },
      error: (error) => {
        this.setErrors = error.error.errors;
      }
    });
  }

  getProductData() {
    this.cardService.getProduct().subscribe({
      next: (data) => {
        if (data.success) {
          this.allProducts = data.result;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onDeleteProduct(productId: number): void {
    const formData = new FormData();
    formData.append('id', productId.toString());

    this.cardService.deleteProduct(formData).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Product has been deleted');
          this.getProductData();
        }
      },
      error: (error) => {
        this.setErrors = error.error.errors;
      }
    });
  }

  onEditProduct(product: any): void {
    this.setErrors = {};
    this.updateProductForm.patchValue({
      id: product.id,
      p_name: product.p_name,
      p_des: product.p_des,
      p_price: product.p_price
    });
  }

  onUpdateSubmit(): void {
    this.setErrors = {};

    const formData = new FormData();
    formData.append('id', this.updateProductForm.get('id')?.value);
    formData.append('p_name', this.updateProductForm.get('p_name')?.value);
    formData.append('p_des', this.updateProductForm.get('p_des')?.value);
    formData.append('p_price', this.updateProductForm.get('p_price')?.value);

    this.cardService.editProduct(formData).subscribe({
      next: (data) => {
        if (data.success) {
          alert('Product updated successfully');
          this.getProductData();
          this.isUpdateSubmitted = false;
          this.updateProductForm.reset();
          this.productUpdated.emit();
        }
      },
      error: (error) => {
        this.setErrors = error.error.errors;
      }
    });
  }

  downloadTableData() {
    const tableData = this.allProducts.map((product: any) => ({
      'Product ID': product.id,
      'Product Name': product.p_name,
      'Description': product.p_des,
      'Price': product.p_price
    }));

    const csvData = this.convertToCSV(tableData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    alert("Data has been downloaded as CSV");
  }

  convertToCSV(objArray: any[]) {
    const array = [Object.keys(objArray[0])].concat(objArray);

    return array.map(row => {
      return Object.values(row).map(value => {
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',');
    }).join('\r\n');
  }

  downloadTableDataAsPDF() {
    const tableData = this.allProducts;
    const tableColumn = ["Product ID", "Product Name", "Description", "Price"];
    const tableRows: any[][] = [];
  
    tableData.forEach((rowData: { id: any; p_name: any; p_des: any; p_price: any; }) => {
      const row = [
        rowData.id,
        rowData.p_name,
        rowData.p_des,
        rowData.p_price,
      ];
      tableRows.push(row);
    });
  }

}
