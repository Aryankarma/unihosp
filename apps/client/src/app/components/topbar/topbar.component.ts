import { Component, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router, RouterModule } from '@angular/router';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-topbar',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SearchbarComponent],
  animations: [
    trigger('hideHider', [
      state(
        'show',
        style({
          opacity: 1,
          filter: 'blur(5px)',
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          filter: 'blur(0px)',
          'z-index': -1,
        })
      ),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('600ms ease-in')),
    ]),
  ],
})
export class TopbarComponent {
  // open = mobile;
  open = false;
  hideHider = false;

  constructor(private authService: AuthService, private router: Router) {
    this.logout = this.logout.bind(this);
  }

  @Input() searchBar: boolean = false;

  routes = [
    {
      routerLink: '/dashboard/welcome',
      title: 'Home',
      icon: 'fa-house',
      hovered: false,
    },
    {
      routerLink: '/dashboard/profile',
      title: 'Profile',
      icon: 'fa-user',
      hovered: false,
    },
    {
      routerLink: '/dashboard/history',
      title: 'History',
      icon: 'fa-file',
      hovered: false,
    },
    {
      routerLink: '/dashboard/hospital',
      title: 'Hospitals',
      icon: 'fa-hospital',
      hovered: false,
    },
    {
      routerLink: '/dashboard/appointments',
      title: 'Appointments',
      icon: 'fa-calendar',
      hovered: false,
    },
    { routerLink: '/about', title: 'About', icon: 'fa-info', hovered: false },
    { title: 'Logout', icon: 'fa-arrow-right-from-bracket', hovered: false },
  ];

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  mouseOver(index: number) {
    this.routes[index].hovered = true;
    this.closeSidebar();
  }

  mouseOverOut(index: number) {
    this.routes[index].hovered = false;
  }

  get stateName() {
    return this.open ? 'show' : 'hide';
  }

  closeSidebar() {
    this.open = false;
    setTimeout(this.hideHiderHandle, 600);
  }

  hideHiderHandle() {
    this.hideHider = false;
  }

  openSidebar(ev: Event) {
    ev.preventDefault();
    this.open = true;
    this.hideHider = true;
  }
}