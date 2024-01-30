import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';


@Injectable()
export class PatientGuard implements CanActivate {

  private logger = new Logger(PatientGuard.name);

  constructor() { }

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true
  }

}
