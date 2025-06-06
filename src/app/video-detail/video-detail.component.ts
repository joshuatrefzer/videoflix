import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent, MatIconModule],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss'
})
export class VideoDetailComponent implements OnInit, OnDestroy {



  constructor(public ps: PopupService, private elementRef: ElementRef, private backendService: BackendService, private router: Router) {

  }

  thumb: string = "";
  video: string = "";
  resolution: boolean = false;
  hideResolution: boolean = false;
  hideInfo: boolean = false;

  low: boolean = false;
  middle: boolean = true;
  high: boolean = false;

  videoIsFavorite: boolean = false;

  ngOnInit(): void {
    this.thumb = environment.baseUrl + this.ps.videoDetail?.thumbnail;
    this.video = environment.baseUrl + this.ps.videoDetail?.video_file;

    if (this.isFavoriteVideo()) {
      this.videoIsFavorite = true;
    } else {
      this.videoIsFavorite = false;
    }
  }


  ngOnDestroy(): void {
    this.ps.videoDetail = undefined;
  }


  isFavoriteVideo() {
    const id = this.ps.videoDetail?.id;
    if (!id) {
      return false;
    }
    const favoriteList = this.backendService.favoriteList?.favorite_list.favorites;
    if (!favoriteList) {
      return false;
    }
    return favoriteList.includes(id);
  }

  changeResolution(path: string, event: MouseEvent) {
    event.stopPropagation();
    this.resolutionUpdate(path);
    this.closeResolutionButtons();
  }

  resolutionUpdate(path: string) {
    this.resetResolutionVars();
    const videoBase = environment.baseUrl + this.ps.videoDetail?.video_file;
    this.video = videoBase.replace(".mp4", path);
  }


  closeResolutionButtons() {
    setTimeout(() => {
      this.hideResolution = true;
    }, 500);
    setTimeout(() => {
      this.resolution = false;
      this.hideResolution = false;
    }, 750);
  }

  resetResolutionVars() {
    this.low = false;
    this.middle = false;
    this.high = false;
  }

  showResolution(event: MouseEvent) {
    event?.stopPropagation();
    this.resolution = true;
  }

  handleContainerClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.querySelector('.popup').contains(event.target)) {
      this.closePopup();
    }
  }

  handlePopupClick(event: MouseEvent) {
    event.stopPropagation();
  }

  closePopup() {
    this.ps.bg = false;
    this.ps.videoDetail = undefined;
  }

  hideInfoBox() {
    this.hideInfo = true;
  }

  showInfoBox(event: MouseEvent) {
    event.stopPropagation();
    this.hideInfo = false;
  }

  addToFavorites(id: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (id) {
      this.backendService.favoriteList?.favorite_list.favorites.push(id);
      this.backendService.updateFavoriteList();
    }
    this.videoIsFavorite = true;
  }


  removeFromFavorites(id: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (id && this.backendService.favoriteList) {
      const index = this.backendService.favoriteList?.favorite_list.favorites.indexOf(id);
      if (index !== -1) {
        this.backendService.favoriteList?.favorite_list.favorites.splice(index, 1);
        this.backendService.updateFavoriteList();
      }
    }
    this.videoIsFavorite = false;
    this.backendService.getFavoriteList();
  }

  
}
