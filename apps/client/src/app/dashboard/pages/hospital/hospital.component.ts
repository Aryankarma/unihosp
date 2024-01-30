import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { UserService } from '../../../services/user.service';
import { Loader } from '@googlemaps/js-api-loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-hospital',
  templateUrl: 'hospital.component.html',
  styleUrls: ['hospital.component.scss', '../../common.style.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HospitalComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) {
    this.getLocationData = this.getLocationData.bind(this);
  }

  @ViewChild('map') mapElement!: ElementRef<HTMLDivElement>;
  map!: google.maps.Map;

  userService$ = this.userService.currentUser;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyC9t2oRtesSGm0c3B1TG0mNNFgr8sb42-o',
      version: 'weekly',
    });

    loader.load().then(async () => {
      // const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      // this.map = new Map(document.getElementById("map") as HTMLElement, {
      //   center: { lat: -34.397, lng: 150.644 },
      //   zoom: 8,
      // });
      const { Map } = (await google.maps.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;
      const element = this.mapElement.nativeElement;
      const location = await this.getLocationData();
      // console.log(location)
      if (element) {
        this.map = new Map(element, {
          center: { lat: location.lat, lng: location.lng },
          zoom: 8,
        });
      }
    });
  }

  async getLocationData() {
    let location = { lat: 20.5937, lng: 78.9629 };
    // console.log('called');

    try {
      location = await new Promise((resolve, reject) => {
        const loc = { lat: 0, lng: 0 };
        navigator.geolocation.getCurrentPosition(
          (position) => {
            loc.lat = position.coords.latitude;
            loc.lng = position.coords.longitude;
            resolve(loc);
          },
          (error) => {
            alert(error.message);
            reject(error);
          }
        );
      });
    } catch (error) {
      // console.log(error);
      return { lat: 20.5937, lng: 78.9629 };
    }
    return location;
  }

  paitentProfile$ = this.profileService.current;
}
