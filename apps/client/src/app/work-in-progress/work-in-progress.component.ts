import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TopbarComponent } from '../components/topbar/topbar.component';

@Component({
  selector: 'uni-work-in-progress',
  standalone: true,
  imports: [CommonModule, TopbarComponent],
  templateUrl: './work-in-progress.component.html',
  styleUrl: './work-in-progress.component.scss',
})
export class WorkInProgressComponent {}
