import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';

import { UserResponse as User } from '@unihosp/api-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User | null>(null);

  get currentUser() {
    return this.user.pipe(
      map((user) => {
        if (user !== null) return user;
        let u: User;
        const sub = this.http.get<User>('/user').subscribe((user) => {
          u = user;
          this.setCurrentUser(user);
          sub.unsubscribe();
        });
        return u!;
      })
    );
  }

  setCurrentUser(user: User | null) {
    this.user.next(user);
  }

  subscription!: Subscription;

  constructor(private http: HttpClient) {}

  refereshCurrentUser() {
    const sub = this.http.get<User>('/user').subscribe((user) => {
      this.setCurrentUser(user);
      sub.unsubscribe();
    });
  }

  getUsersByMail(query: string) {
    return this.http.post<{ email?: boolean; handle?: boolean }>(
      '/user/exists',
      {
        email: query,
      }
    );
  }
}
