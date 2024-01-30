import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { rootEndPoint } from './rootEndPoint';
// import UniCookieService from './services/unicookie.service';

export function RequestInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const newRequest = request.clone({
    headers: new HttpHeaders({
      'x-development-key': '86dff15115508c9fb1da8c748740e753',
      'app-id': 'eba833927e93be1e8da25766c67f5ef8',
    }),
    withCredentials: true,
    url: `${rootEndPoint}${request.url}`,
  });
  return next(newRequest);
}
