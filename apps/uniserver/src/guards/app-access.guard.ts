import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppAuthentication } from '../app.auth.service';
import { Request } from 'express';

@Injectable()
export class AppAccessGuard implements CanActivate {
  constructor(private appAuthentication: AppAuthentication) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const HeaderAppAccessCode = request.headers['app-id'] as string;

    if (!HeaderAppAccessCode) return false;

    if (!this.appAuthentication.verifyAppWithID(HeaderAppAccessCode))
      return false;

    return true;
  }
}
