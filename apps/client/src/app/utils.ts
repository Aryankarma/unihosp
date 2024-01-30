import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckBrowser {
  isBrowser() {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId);
  }
}
