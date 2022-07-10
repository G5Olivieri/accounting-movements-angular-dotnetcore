import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken !== null && accessToken !== undefined) {
      const cloned = request.clone({
        headers: request.headers.set('authorization', `Bearer ${accessToken}`)
      })
      return next.handle(cloned)
    }
    return next.handle(request);
  }
}
