import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface AStoreType {
  aupl: string;
  asecl: string;
  aexpl: string;
}

interface RStoreType {
  rupl: string;
  rsecl: string;
  rexpl: string;
}

type CookieName =
  | 'aupl'
  | 'ascel'
  | 'aexpl'
  | 'rupl'
  | 'rscel'
  | 'rexpl'
  | 'uid'
  | 'rid';

@Injectable({
  providedIn: 'root',
})
export default class UniCookieService {
  constructor(private cookie: CookieService) {}

  private divideAccessToken(accessToken: string): AStoreType {
    const [aupl, asecl, aexpl] = accessToken.split('.');
    return { aupl, asecl, aexpl };
  }

  private divideRefreshToken(refreshToken: string): RStoreType {
    const [rupl, rsecl, rexpl] = refreshToken.split('.');
    return { rupl, rsecl, rexpl };
  }

  storeAccessToken(
    payload: string,
    options: { expire?: number; path?: string } = {}
  ) {
    // eslint-disable-next-line prefer-const
    let { path, expire } = options;
    const cookies = this.divideAccessToken(payload);
    expire = expire || 7200;
    this.cookie.set('aupl', cookies.aupl, expire, path);
    this.cookie.set('asecl', cookies.asecl, expire, path);
    this.cookie.set('aexpl', cookies.aexpl, expire, path);
  }

  store(
    name: CookieName,
    payload: string,
    options: { expire?: number; path?: string } = {}
  ) {
    // eslint-disable-next-line prefer-const
    let { path, expire } = options;
    expire = expire || 2592000;
    this.cookie.set(name, payload, expire, path);
  }

  getAccessToken() {
    const aupl = this.cookie.get('aupl');
    const asecl = this.cookie.get('asecl');
    const aexpl = this.cookie.get('aexpl');
    return aupl && asecl && aexpl ? `${aupl}.${asecl}.${aexpl}` : null;
  }

  getRefreshToken() {
    const rupl = this.cookie.get('rupl');
    const rsecl = this.cookie.get('rsecl');
    const rexpl = this.cookie.get('rexpl');
    return rupl && rsecl && rexpl ? `${rupl}.${rsecl}.${rexpl}` : null;
    // return `${}.${this.cookie.get("rsecl")}.${this.cookie.get("rexpl")}`;
  }

  retrieve(name: CookieName) {
    return this.cookie.check(name) ? this.cookie.get(name) : undefined;
  }

  storeRefreshToken(
    payload: string,
    options: { expire?: number; path?: string } = {}
  ) {
    // eslint-disable-next-line prefer-const
    let { path, expire } = options;
    const cookies = this.divideRefreshToken(payload);
    expire = expire || 2592000;
    this.cookie.set('rupl', cookies.rupl, expire, path);
    this.cookie.set('rsecl', cookies.rsecl, expire, path);
    this.cookie.set('rexpl', cookies.rexpl, expire, path);
  }

  deleteAllCookie() {
    const cookieToDelete = [
      'aupl',
      'ascel',
      'aexpl',
      'rupl',
      'rscel',
      'rexpl',
      'uid',
      'rid',
    ];
    cookieToDelete.forEach((v) => {
      this.cookie.delete(v, '/');
    });
  }
}
