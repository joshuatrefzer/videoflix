import { Component, OnInit } from '@angular/core';
import { VideoComponent } from '../video/video.component';
import { BackendService } from '../services/backend.service';

import { log } from 'console';
import { Video, VideoGenre } from '../services/interface';
import { async } from 'rxjs';
import { Router } from '@angular/router';
import { PopupService } from '../services/popup.service';

enum Genre {
  Documentation = "documentation",
  Blockbuster = "blockbuster",
  Comedy = "comedy",
}
@Component({
  selector: 'app-homescreen',
  standalone: true,
  imports: [VideoComponent],
  templateUrl: './homescreen.component.html',
  styleUrl: './homescreen.component.scss'
})
export class HomescreenComponent implements OnInit {
  genres: VideoGenre[] = ["documentation", "blockbuster", "comedy", "action", "drama", "sitcom"];
  videos: Video[] = [];
  loader: boolean = false;

  constructor(public backend: BackendService, private router: Router, private ps: PopupService) {
    this.ps.activeLink = '/home';
  }

  /**
   * A function "fetchVideoData" in Backend Service Intance is called. When the Component starts their livecycle.
   */
  ngOnInit(): void {
    // this.backend.fetchVideoData();
    // this.backend.getFavoriteList();
  }

  /**
   * Navigates to Uploadpage
   */
  navigateToUpload() {
    this.router.navigate(['/upload']);
  }




}
