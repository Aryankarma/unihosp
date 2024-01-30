import { Component } from '@angular/core';
import { SearchService } from './search.service';
import { Subscription, tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class SearchbarComponent {
  focused = false;

  constructor(protected searchService: SearchService) {}

  results$ = this.searchService.queryResult('').pipe(
    tap((res) => {
      console.log(res);
      return res;
    })
  );

  subscription!: Subscription;

  onFocus($event: FocusEvent) {
    $event.preventDefault();
    this.focused = true;
  }
  onBlur($event: FocusEvent) {
    $event.preventDefault();
    this.focused = false;
  }

  onSearchInput($event: KeyboardEvent) {
    const element = $event.target as HTMLInputElement;
    this.results$ = this.searchService.queryResult(element.value);
  }
}
