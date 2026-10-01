// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-dashboard',
// //   imports: [],
// //   templateUrl: './dashboard.html',
// //   styleUrl: './dashboard.css',
// // })
// // export class Dashboard {}

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { Auth } from '../auth/services/auth';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css'
// })
// export class Dashboard {
//   constructor(private authService: Auth, private router: Router) {}

//   logout(): void {
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }

//   comingSoon(event: Event): void {
//     event.preventDefault();
//     Swal.fire('Coming Soon', 'Yeh module jaldi hi banayenge! 🚧', 'info');
//   }
// }
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // imports: [RouterLink],
imports:[],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(private authService: Auth, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  comingSoon(event: Event): void {
    event.preventDefault();
    Swal.fire('Coming Soon', 'Yeh module jaldi hi banayenge! 🚧', 'info');
  }
}