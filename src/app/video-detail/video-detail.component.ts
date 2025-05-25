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


  /**
 * Initializes component data on component initialization.
 */
  ngOnInit(): void {
    this.thumb = environment.baseUrl + this.ps.videoDetail?.thumbnail;
    this.video = environment.baseUrl + this.ps.videoDetail?.video_file;

    if (this.isFavoriteVideo()) {
      this.videoIsFavorite = true;
    } else {
      this.videoIsFavorite = false;
    }
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.ps.videoDetail = undefined;
  }

  /**
   * Checks if the current video is in the user's list of favorite videos.
   * @returns True if the video is a favorite, false otherwise.
   */
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

  /**
   * Changes the resolution of the video.
   * @param path - New resolution path.
   * @param event - Mouse event that triggered the change.
   */
  changeResolution(path: string, event: MouseEvent) {
    event.stopPropagation();
    this.resolutionUpdate(path);
    this.closeResolutionButtons();
  }

  /**
   * Updates the video resolution.
   * @param path - New resolution path.
   */
  resolutionUpdate(path: string) {
    this.resetResolutionVars();
    const videoBase = environment.baseUrl + this.ps.videoDetail?.video_file;
    this.video = videoBase.replace(".mp4", path);
  }

  /**
   * Closes the resolution selection buttons after a delay.
   */
  closeResolutionButtons() {
    setTimeout(() => {
      this.hideResolution = true;
    }, 500);
    setTimeout(() => {
      this.resolution = false;
      this.hideResolution = false;
    }, 750);
  }

  /**
   * Resets resolution selection variables.
   */
  resetResolutionVars() {
    this.low = false;
    this.middle = false;
    this.high = false;
  }

  /**
   * Shows the resolution selection.
   * @param event - Mouse event that triggered the show.
   */
  showResolution(event: MouseEvent) {
    event?.stopPropagation();
    this.resolution = true;
  }

  /**
   * Handles click events outside the popup container to close the popup.
   * @param event - Mouse event that triggered the container click.
   */
  handleContainerClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.querySelector('.popup').contains(event.target)) {
      this.closePopup();
    }
  }

  /**
   * Handles click events inside the popup to stop propagation.
   * @param event - Mouse event that triggered the popup click.
   */
  handlePopupClick(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * Closes the popup and cleans up related resources.
   */
  closePopup() {
    this.ps.bg = false;
    this.ps.videoDetail = undefined;
  }

  /**
   * Hides the information box.
   */
  hideInfoBox() {
    this.hideInfo = true;
  }

  /**
   * Shows the information box.
   * @param event - Mouse event that triggered the show.
   */
  showInfoBox(event: MouseEvent) {
    event.stopPropagation();
    this.hideInfo = false;
  }



  /**
 * Adds the specified video ID to the user's list of favorite videos.
 * @param id - The ID of the video to add to favorites.
 * @param event - The mouse event that triggered the action.
 */
  addToFavorites(id: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (id) {
      this.backendService.favoriteList?.favorite_list.favorites.push(id);
      this.backendService.updateFavoriteList();
    }
    this.videoIsFavorite = true;
  }

  /**
   * Removes the specified video ID from the user's list of favorite videos.
   * @param id - The ID of the video to remove from favorites.
   * @param event - The mouse event that triggered the action.
   */
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
