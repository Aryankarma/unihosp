import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';

@Component({
  selector: 'uni-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('routerAnimation', [
      //   transition('* => *', [
      //     style({
      //       background: 'blue'
      //     }),
      //     animate(1000)
      //   ])
    ]),
  ],
  standalone: true,
  imports: [RouterModule, SidebarComponent, TopbarComponent],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.userService.currentUser.subscribe(user => {
    //   if (!user) {
    //     this.router.navigate(['/auth/signup'])
    //   }
    // })
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) return outlet.activatedRoute.snapshot.url;
    return null;
  }
}
