import { Component, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HospitalDetials } from '../interfaces/publicProfile.interface';
import { ActivatedRoute } from '@angular/router';
import { PublicProfileService } from '../services/publicProfile.service';
import { TopbarModule } from '../components/topbar/topbar.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-public-profile',
  standalone: true,
  imports: [TopbarModule, CommonModule],
  templateUrl: './public-profile.component.html',
  styleUrl: './public-profile.component.scss'
})
export class PublicProfileComponent {
  private publicProfileService: PublicProfileService = Inject(PublicProfileService)
  constructor(private activatedRoute: ActivatedRoute) { }

  subscription!: Subscription;

  profileId: string = '';

  profile: any | null = null;

  private isDoctorRoute() {
    console.log(this.activatedRoute.snapshot.url[0].path.startsWith("d"))
    return this.activatedRoute.snapshot.url[0].path.startsWith("d");
  }

  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe(param => {
      console.log(param['id']);

      if (!param['id']) return;
      this.profileId = param['id'];
      if (this.isDoctorRoute()) {
        console.log("doctor route")
        this.publicProfileService.getDoctorById(this.profileId).subscribe(profile => {
          console.log(profile);
          this.profile = profile;
        })
      } else {
        this.publicProfileService.getPatientById(this.profileId).subscribe(profile => {
          console.log(profile);
          this.profile = profile
        })
      }

    })
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
