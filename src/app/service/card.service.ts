import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrl = "http://localhost/cart/api-1"

  constructor(private http: HttpClient) { }

  addProduct(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}/addProducts`, formData);
  }

  // getProduct(details:string): Observable<any>{
  //   return this.http.get(`${this.apiUrl}/getProducts`, {params:{details}})
  // }



  getProduct(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getProducts`);
  }
  


  // getProduct(product: { id: string, p_name: string, p_des: string, p_price: string }): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getProducts`, { params: product });
  // }

  

  deleteProduct(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}/deleteProduct`, formData);
  }

  // deleteProduct(productId: number): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('id', productId.toString());
  //   return this.http.post(`${this.apiUrl}/deleteProduct`, formData);
  // }

  editProduct(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}/editProduct`, formData);
  }

}

