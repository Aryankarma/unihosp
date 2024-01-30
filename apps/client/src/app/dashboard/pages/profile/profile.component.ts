import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../../loading/loading.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { UserProfileResponse, UserResponse } from '@unihosp/api-interface';

@Component({
  selector: 'uni-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [
    'profile.component.scss',
    '../../common.style.scss',
    '../../../auth/common-styles/password-field.component.scss',
  ],
  standalone: true,
  imports: [LoadingComponent, CommonModule],
})
export class ProfileComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platoformId: object
  ) {}
  @ViewChild('file') file!: ElementRef<HTMLInputElement>;

  userProfile$!: Observable<UserResponse | null>;

  paitentProfile$!: Observable<UserProfileResponse>;

  loading = false;

  // editable = false;

  // makeEditable() {
  //   this.editable = true;
  // }

  // cancelEditable() {
  //   this.editable = false;
  // }

  handlePhotoUpload() {
    const formData = new FormData();
    if (!this.file.nativeElement.files) return;
    formData.append('file', this.file.nativeElement.files[0]);
    this.loading = true;
    this.profileService.updateAvatar(formData).subscribe(() => {
      // console.log(data);
      this.userService.refereshCurrentUser();
      this.loading = false;
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    if (isPlatformBrowser(this.platoformId)) {
      this.paitentProfile$ = this.profileService.current;
      this.userProfile$ = this.userService.currentUser;
    }
  }
}
