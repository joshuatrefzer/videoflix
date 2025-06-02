import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {
  count: number = 5;

  constructor(private router: Router, private auth: AuthService) {
    this.startCount();

    if (this.auth.userisLoggedIn()) {
      this.router.navigate(['/home'])
    }
  }
  /**
   * Starts a countdown from 5 to 0, redirecting to the authentication page when it reaches 0.
   * The countdown updates every second.
   */
  startCount(): void {
    const interval = setInterval(() => {
      if (this.count <= 0) {
        clearInterval(interval);
        this.redirect();
      }
      this.count--;
    }, 1000);
  }

  redirect(): void {
    this.router.navigate(['/authentication']);
  }




}
