import {Routes} from '@angular/router';
import {LoginComponent} from './components/pages/login/login.component';
import {HomepageComponent} from './components/pages/homepage/homepage.component';
import {CarsComponent} from './components/pages/cars/cars.component';
import {ProfileComponent} from './components/pages/profile/profile.component';
import {ReservationsComponent} from './components/pages/reservations/reservations.component';
import {RegistrationComponent} from './components/pages/registration/registration.component';
import {AddCarComponent} from './components/pages/add-car/add-car.component';
import {HomepageCustomerComponent} from './components/pages/homepage-customer/homepage-customer.component';
import {HeaderComponent} from './components/core/header/header.component';
import {AddReservationComponent} from './components/pages/add-reservation/add-reservation.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent, title: 'Login page'},
  {path: 'header', component: HeaderComponent, title: 'Header'},
  {path: 'homepage', component: HomepageComponent, title: 'Home page'},
  {path: 'homepage-customer', component: HomepageCustomerComponent, title: 'Customer Home page'},
  {path: 'cars', component: CarsComponent, title: 'Car page'},
  {path: 'addCar', component: AddCarComponent, title: 'AddCar page'},
  {path: 'addCar/:id', component: AddCarComponent, title: 'UpdateCar page'},
  {path: 'registration/:id', component: RegistrationComponent, title: 'Edit User page'},
  {path: 'profile', component: ProfileComponent, title: 'Profile page'},
  {path: 'reservations', component: ReservationsComponent, title: 'Reservations page'},
  {path: 'reservations/:id', component: ReservationsComponent, title: 'Reservations page'},
  {path: 'addReservation', component: AddReservationComponent, title: 'AddReservation page'},
  {path: 'addReservation/:id', component: AddReservationComponent, title: 'UpdateReservation page'},
  {path: 'registration', component: RegistrationComponent, title: 'Registration page'},
  {path: 'registration/:id', component: RegistrationComponent, title: 'Edit User page'},
]
