import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { VideoComponent } from './video/video.component';
import { AuthService } from './services/auth.service';
import { PopupService } from './services/popup.service';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { environment } from '../environments/environment.development';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, HeaderComponent, VideoComponent, VideoDetailComponent, LoaderComponent]
})
export class AppComponent {
  title = 'videoflix';
  deleteUserQuestion:boolean = false;

  constructor(public authService: AuthService, private router: Router,  public popup: PopupService) {

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        const url = this.router.url;
        if (url.includes('/resetpassword') || url.includes('/forgotpassword') || url.includes('/success')) {
          return
        } else {
          this.handleLogin();
        }
      }
    });  
  }

  handleLogin(){
    if (this.userIsLoggedIn()) {
        this.authService.userisLoggedIn = true;
        
      } else {
        this.redirectToAuth();
      }
  }

  userIsLoggedIn(){
    if (this.authService.isUserLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }

  redirectToAuth() {
    this.router.navigate(['/authentication']);
  }


}
