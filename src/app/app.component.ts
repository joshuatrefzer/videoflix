import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { VideoComponent } from './video/video.component';
import { AuthService } from './services/auth.service';
import { PopupService } from './services/popup.service';
import { VideoDetailComponent } from './video-detail/video-detail.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent, VideoComponent, VideoDetailComponent]
})
export class AppComponent {
  title = 'videoflix';

  constructor(public authService: AuthService, private router: Router, public popup:PopupService ){
    if (!this.authService.userisLoggedIn) {
      this.router.navigate(['/authentication'])
    }
  }


}
