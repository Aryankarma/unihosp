import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, map } from 'rxjs';
import UniCookieService from './services/unicookie.service';


@Injectable()
export class RequestsInterceptor implements HttpInterceptor {

  private readonly rootEndPoint = `http://localhost:3000`;

  constructor(private unicookieService: UniCookieService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Original: ', request);
    let accessToken = this.unicookieService.getAccessToken();
    // if (!accessToken) { this.router.navigate(['/auth/login']); }
    const newRequest = request.clone({
      url: `${this.rootEndPoint}${request.url}`,
      headers: accessToken ? new HttpHeaders({ 'authorization': `UNIHOSP ${accessToken}` }) : undefined
    })
    console.log('Update: ', newRequest);
    return next.handle(newRequest);
  }
}