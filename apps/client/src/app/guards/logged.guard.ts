import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const LoggedInGuard: CanActivateFn = () => {
  // const authService = inject(AuthService);
  const userService = inject(UserService);

  const routerToMove = inject(Router).createUrlTree(['/dashboard']);
  // const notLoggedIn = authService.notLoggedIn.pipe(
  //   map(isNotLoggedIn => {
  //     if (isNotLoggedIn) {
  //       return true;
  //     }
  //     return router.createUrlTree(["/dashboard"]);
  //   })
  // );

  const continueOnPage = userService.currentUser.pipe(
    map((user) => {
      if (user) {
        console.log(user);
        return routerToMove;
      }
      return true;
    })
  );

  console.log('Checking User LoggedIn', continueOnPage);
  return continueOnPage;
};

export const DashboardGuard: CanActivateFn = () => {
  return false;
};
