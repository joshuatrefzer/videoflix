import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { VideoComponent } from './video/video.component';
import { AuthService } from './services/auth.service';
import { PopupService } from './services/popup.service';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { environment } from '../environments/environment.development';
import { LoaderComponent } from './loader/loader.component';
import { BottomBarComponent } from "./bottom-bar/bottom-bar.component";
import { FavoritesComponent } from './favorites/favorites.component';
import { BackendService } from './services/backend.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent, VideoComponent, VideoDetailComponent, LoaderComponent, BottomBarComponent, FavoritesComponent]
})
export class AppComponent implements OnInit {
  title = 'videoflix';
  deleteUserQuestion:boolean = false;
  screenWidth: number |undefined;

  constructor(public authService: AuthService, private router: Router,  public popup: PopupService, private backenService: BackendService) {

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
    this.getScreenWidth();
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
    this.authService.userisLoggedIn = false;
    this.popup.closePopups();
  }

  navigateToLegals(){
    this.router.navigate(['/legals']);
    this.popup.closePopups();
  }

  ngOnInit(): void {
      this.backenService.fetchVideoData();
      this.backenService.getFavoriteList();
  }


}
