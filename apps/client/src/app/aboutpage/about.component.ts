import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'uni-abt',
  templateUrl: './about.component.html',
  styleUrls: [
    './about.component.scss',
    './about.responsive.scss',
    './about.animation.scss',
  ],
  imports: [TopbarComponent],
  standalone: true,
})
export class AboutComponent implements OnInit, OnDestroy {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  observer1!: IntersectionObserver;
  observer2!: IntersectionObserver;
  observer3!: IntersectionObserver;
  observer4!: IntersectionObserver;

  appName = 'United Hospital';

  e1!: Element | null;
  e2!: Element | null;
  e3!: Element | null;
  e4!: Element | null;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.observer1 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // document.querySelectorAll(".addAnim")[0].classList.add("animationMain");
          document
            .querySelectorAll('.addAnim')[0]
            .classList.add('animationtoRight');
          document
            .querySelectorAll('.addAnim')[1]
            .classList.add('animationtoLeft');
        }
      });
    });

    this.observer2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document
            .querySelectorAll('.addAnim1')[0]
            .classList.add('animationMain');
          document
            .querySelectorAll('.addAnim1')[1]
            .classList.add('animationTop');
        }
      });
    });

    this.observer3 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document
            .querySelectorAll('.addAnim2')[0]
            .classList.add('animationTop');
        }
      });
    });

    this.observer4 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document
            .querySelectorAll('.addAnim3')[0]
            .classList.add('animationtoLeft');
          document
            .querySelectorAll('.addAnim3')[1]
            .classList.add('animationTop');
          document
            .querySelectorAll('.addAnim3')[2]
            .classList.add('animationTop');
        }
      });
    });

    this.e1 = document.querySelector('.addAnim');
    this.e2 = document.querySelector('.addAnim1');
    this.e3 = document.querySelector('.addAnim2');
    this.e4 = document.querySelector('.addAnim3');
    if (this.e1 !== null) this.observer1.observe(this.e1);
    if (this.e2 !== null) this.observer2.observe(this.e2);
    if (this.e3 !== null) this.observer3.observe(this.e3);
    if (this.e4 !== null) this.observer4.observe(this.e4);
  }

  ngOnDestroy(): void {
    if (this.observer1 && this.observer2 && this.observer3 && this.observer4) {
      if (this.e1 !== null) this.observer1.unobserve(this.e1);
      if (this.e2 !== null) this.observer2.unobserve(this.e2);
      if (this.e3 !== null) this.observer3.unobserve(this.e3);
      if (this.e4 !== null) this.observer4.unobserve(this.e4);
    }
  }
}
