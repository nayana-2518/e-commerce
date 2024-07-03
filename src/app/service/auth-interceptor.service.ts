import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('your-endpoint-that-needs-auth')) {
      const modifiedReq = request.clone({ headers: request.headers.append('auth', 'abcd') });
      return next.handle(modifiedReq);
    } else {
      return next.handle(request);
    }
  }
}





// import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthInterceptorService implements HttpInterceptor {

//   constructor() { }
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // console.log('Auth Interceptor Called!');
//     // return next.handle(request)


//     //used to send a request from our angular application (it is apply for all the request method post, get, put and delete)

//     const modifiedReq = request.clone({ headers: request.headers.append('auth', 'abcd') })
//     return next.handle(modifiedReq).pipe(tap((event) => {
//       if (event.type === HttpEventType.Response) {
//         console.log('Response has arrived. Response data: ');
//         console.log(event.body);
//       }
//     }));

//   }
// } 


