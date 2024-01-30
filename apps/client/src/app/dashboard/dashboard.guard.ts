import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import UniCookieService from '../services/unicookie.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardGuard {
  constructor(
    private router: Router,
    private user: UserService,
    private cookie: UniCookieService,
    private authService: AuthService
  ) {
    // this.navigate = this.navigate.bind(this);
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.user.currentUser.pipe(
      filter((user) => user !== undefined),
      map((user) => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
  canActivateChild():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.user.currentUser.pipe(
      filter((user) => user != undefined),
      map((user) => {
        return user ? true : false;
      })
    );

    return true;
  }
}
