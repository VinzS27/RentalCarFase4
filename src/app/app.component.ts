import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/core/footer/footer.component';
import {HeaderComponent} from './components/core/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'RentalCarAngular19';

}
