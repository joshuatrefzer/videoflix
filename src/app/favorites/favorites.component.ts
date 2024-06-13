import { Component, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { BackendService } from '../services/backend.service';
import { VideoGenre } from '../services/interface';
import { VideoComponent } from '../video/video.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [VideoComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  constructor(private ps: PopupService, private http: HttpClient, public backendService: BackendService, private router: Router) {
    this.ps.activeLink = '/favorites';
    // backendService.getVideos();
    backendService.getFavoriteList();
  }

  genres: VideoGenre[] = ["documentation", "blockbuster", "comedy", "action", "drama", "sitcom"];


  /**
   * Navigates to Uploadpage
   */
  navigateToHome() {
    this.router.navigate(['/home']);
  }

}
