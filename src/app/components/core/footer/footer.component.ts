import {Component} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  imports: [DatePipe],
})

export class FooterComponent {
  currentDate: Date = new Date();
}
