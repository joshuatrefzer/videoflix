import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './services/auth.service';
import { PopupService } from './services/popup.service';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { LoaderComponent } from './loader/loader.component';
import { BottomBarComponent } from "./bottom-bar/bottom-bar.component";
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, HeaderComponent, VideoDetailComponent, LoaderComponent, BottomBarComponent]
})
export class AppComponent implements OnInit {
  title = 'videoflix';
  deleteUserQuestion: boolean = false;
  screenWidth: number | undefined;

  constructor(public authService: AuthService, private router: Router, public popup: PopupService, private backenService: BackendService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        if (url.includes('/resetpassword') || url.includes('/forgotpassword') || url.includes('/success')) {
          return
        } else {
          this.handleLogin();
        }
      }
    });
    this.getScreenWidth();
  }

  ngOnInit(): void {
    if (this.userIsLoggedIn()) {
      this.backenService.fetchVideoData();
      this.backenService.getFavoriteList();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenWidth() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 1000) {
      this.popup.isMobile = true;
    } else {
      this.popup.isMobile = false;
    }
  }

  handleLogin() {
    if (this.userIsLoggedIn()) {
      this.authService.userisLoggedIn.set(true);
    } else {
      this.redirectToAuth();
    }
  }

  userIsLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  redirectToAuth() {
    this.router.navigate(['/authentication']);
    this.authService.userisLoggedIn.set(false);
    this.popup.closePopups();
  }


  navigateToLegals() {
    this.router.navigate(['/legals']);
    this.popup.closePopups();
  }


}
