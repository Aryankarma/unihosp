import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../../authentication/services/auth.service';



@Injectable()
export class HospitalGuard implements CanActivate {

  private logger = new Logger(HospitalGuard.name);

  constructor(private reflector: Reflector, private authService: AuthService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<Role[]>('role', context.getClass());

    const request: Request = context.switchToHttp().getRequest();
    const user: User = request.body['user'];
    console.log(user);

    this.logger.debug(`Matching roles: ${this.matchRoles(role, user.role)}`)
    return this.matchRoles(role, user.role)
  }
  private matchRoles(roles: Role[], userRole: Role) {
    return roles.includes(userRole);
  }

}
