import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  imports: [DatePipe],
})
export class FooterComponent implements OnInit {

  currentDate: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
