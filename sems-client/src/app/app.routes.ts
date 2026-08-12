// import { Routes } from '@angular/router';
// import { Login } from './auth/login/login';
// import { Signup } from './auth/signup/signup';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: Login },
//   { path: 'signup', component: Signup },
//   { path: '**', redirectTo: 'login' }
// ];

import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'login' }
];