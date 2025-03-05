import {Routes} from '@angular/router';
import {LoginComponent} from './components/forms/login/login.component';
import {HomepageComponent} from './components/pages/homepage/homepage.component';
import {CarsComponent} from './components/pages/cars/cars.component';
import {ProfileComponent} from './components/pages/profile/profile.component';
import {ReservationsComponent} from './components/pages/reservations/reservations.component';
import {RegistrationComponent} from './components/forms/registration/registration.component';
import {AddCarComponent} from './components/forms/add-car/add-car.component';
import {HomepageCustomerComponent} from './components/pages/homepage-customer/homepage-customer.component';
import {HeaderComponent} from './components/core/header/header.component';
import {AddReservationComponent} from './components/forms/add-reservation/add-reservation.component';
import {RouteGuardService} from '../services/route-guard.service';

export const routes: Routes = [
  {path: 'login', component: LoginComponent, title: 'Login page'},
  {path: 'header', component: HeaderComponent, title: 'Header'},
  {path: 'homepage', component: HomepageComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] }, title: 'Home page'},
  {path: 'homepage-customer', component: HomepageCustomerComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_CUSTOMER]'] }, title: 'Customer Home page'},
  {path: 'cars', component: CarsComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_CUSTOMER]', '[ROLE_ADMIN]'] }, title: 'Car page'},
  {path: 'addCar', component: AddCarComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] }, title: 'AddCar page'},
  {path: 'addCar/:id', component: AddCarComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] }, title: 'UpdateCar page'},
  {path: 'registration/:id', component: RegistrationComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] }, title: 'Edit User page'},
  {path: 'profile', component: ProfileComponent,canActivate: [RouteGuardService],
    data: { role: ['[ROLE_CUSTOMER]', '[ROLE_ADMIN]'] },  title: 'Profile page'},
  {path: 'reservations', component: ReservationsComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_CUSTOMER]', '[ROLE_ADMIN]'] }, title: 'Reservations page'},
  {path: 'reservations/:id', component: ReservationsComponent,canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] },  title: 'Reservations page'},
  {path: 'addReservation', component: AddReservationComponent,canActivate: [RouteGuardService],
    data: { role: ['[ROLE_CUSTOMER]'] }, title: 'AddReservation page'},
  {path: 'addReservation/:id', component: AddReservationComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_CUSTOMER]'] }, title: 'UpdateReservation page'},
  {path: 'registration', component: RegistrationComponent, canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] }, title: 'Registration page'},
  {path: 'registration/:id', component: RegistrationComponent,canActivate: [RouteGuardService],
    data: { role: ['[ROLE_ADMIN]'] },  title: 'Edit User page'},
]
