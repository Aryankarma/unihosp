import {
  animate,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UniDirectivesModule } from '../directives/unidirectives.module';
import { ValidatorsModule } from '../Validators/validators.module';

@Component({
  selector: 'uni-auth',
  templateUrl: 'authentication.component.html',
  styleUrls: ['authentication.component.scss'],
  animations: [
    trigger('routerAnimation', [
      state(
        'unknown',
        style({
          width: '300px',
          height: '420px',
        })
      ),
      state(
        'login',
        style({
          width: '320px',
          height: '420px',
        })
      ),
      state(
        'signup',
        style({
          width: '320px',
          height: '520px',
        })
      ),
      state(
        'forgot',
        style({
          width: '320px',
          height: '420px',
        })
      ),
      state(
        'otp',
        style({
          width: '320px',
          height: '420px',
        })
      ),
      animateChild('unknown => login', '320px', '420px', 'left'),
      animateChild('login => signup', '320px', '520px'),
      animateChild('signup => login', '320px', '420px', 'right'),
      animateChild('forgot => login', '320px', '420px', 'right'),
      animateChild('login => forgot', '320px', '420px'),
      animateChild('signup => otp', '460px', '260px'),
      animateChild('otp => signup', '320px', '520px', 'right'),
    ]),
  ],
  imports: [
    LoadingComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UniDirectivesModule,
    ValidatorsModule,
    RouterModule,
  ],

  standalone: true,
})
export class AuthenticationComponent {
  constructor() {}

  switchPage(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}

type PageTransistionDirection = 'left' | 'right' | 'up' | 'down';

function animateChild(
  stateChangeExp: string,
  width: string | number,
  height: string | number,
  direction: PageTransistionDirection = 'left'
  // moretriggers?: AnimationMetadata[]
) {
  const dtr = direction === 'left' || direction === 'down' ? 1 : -1;

  const xORy = direction === 'left' || direction === 'right' ? 'X' : 'Y';

  const optional = { optional: true };

  return transition(stateChangeExp, [
    query(
      ':enter, :leave',
      style({
        position: 'absolute',
        transform: `translate${xORy}(${120 * dtr}%)`,
        left: '0%',
        width: '100%',
        opacity: 0,
      }),
      optional
    ),
    group([
      animate(
        '600ms ease',
        style({
          width,
          height,
        })
      ),
      query(':leave', [
        animate(
          `600ms ease-out`,
          style({
            opacity: 1,
            transform: `translate${xORy}(${-120 * dtr}%)`,
          })
        ),
      ]),
      query(':enter', [
        animate(
          `600ms 200ms ease-out`,
          style({
            opacity: 1,
            transform: `translate${xORy}(0%)`,
          })
        ),
      ]),
    ]),
  ]);
}
