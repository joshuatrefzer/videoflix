import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {
  count: number = 5;

  constructor(private router: Router) {
    this.startCount();
  }

  startCount() {
    const interval = setInterval(() => {
      if (this.count <= 0) {
        clearInterval(interval);
        this.redirect();
      }
      this.count--;
    }, 1000);
  }

  redirect() {
    this.router.navigate(['/authentication']);
  }




}
