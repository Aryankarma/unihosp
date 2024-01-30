import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/services/auth.service';



@Injectable()
export class DevelopmentGuard implements CanActivate {

  constructor(private readonly authService: AuthService,
    private configService: ConfigService) { }

  canActivate(

    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.headers["x-development-key"] === this.configService.get('DEVELOPMENT_KEY');
  }
}
