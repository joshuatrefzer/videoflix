import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { VideoComponent } from './video/video.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent, VideoComponent]
})
export class AppComponent {
  title = 'videoflix';

  constructor(public authService: AuthService, private router: Router ){
    if (!this.authService.userisLoggedIn) {
      this.router.navigate(['/authentication'])
    }
  }


}
