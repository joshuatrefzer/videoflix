import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable, filter, take } from 'rxjs';
import { FavoriteList, Video, VideoGenre, SimpleFavoriteList } from './interface';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})

export class BackendService {
  videoUrl = environment.baseUrl + '/api/videos/';
  uploadUrl = environment.baseUrl + '/api/upload/';
  favoritesUrl = environment.baseUrl + '/favorites/';
  favoriteListUrl = environment.baseUrl + '/favorite_list/';

  favoriteList: FavoriteList | undefined;
  videos: Video[] = [];
  uploadProgress: number = 0;
  uploadSuccessful: boolean = false;

  favoriteListLenght: number = 0;

  constructor(private http: HttpClient, private router: Router, private ps: PopupService, private auth: AuthService) { }


  /**
 * Fetches video data from the backend.
 * Retrieves the videos using the getVideos method and updates the videos list.
 * Displays an error popup if the data cannot be loaded.
 */
  fetchVideoData() {
    this.getVideos().pipe(take(1)).subscribe(
      {
        next: (data: Video[]) => {
          this.videos = data;
          this.auth.loader.set(false);
        },
        error: error => {
          this.auth.loader.set(false);
          this.ps.errorPopup('Error by loading data from backend');
        }
      }
    );
  }


  /**
  * Gets the list of videos from the backend.
  *
  * @returns {Observable<Video[]>} An observable containing the list of videos.
  */
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.videoUrl);
  }


  /**
  * Filters the videos by the specified genre.
  *
  * @param {VideoGenre} genreToFilter - The genre to filter the videos by.
  * @returns {Video[]} The list of filtered videos.
  */
  filterVideos(genreToFilter: VideoGenre): Video[] {
    let filteredVideos: Video[];
    if (genreToFilter) {
      filteredVideos = this.videos.filter(video => video.genre === genreToFilter);
    } else {
      filteredVideos = [];
    }
    return filteredVideos;
  }


  /**
  * Filters the favorite videos by the specified genre.
  *
  * @param {VideoGenre} genreToFilter - The genre to filter the favorite videos by.
  * @returns {Video[]} The list of filtered favorite videos.
  */
  filterFavoriteVideos(genreToFilter: VideoGenre): Video[] {
    let filteredVideos: Video[];
    const favoriteVideos = this.favoriteList?.favorite_videos;
    if (genreToFilter && favoriteVideos) {
      filteredVideos = favoriteVideos.filter(video => video.genre === genreToFilter);
    } else {
      filteredVideos = [];
    }
    return filteredVideos;
  }


  /**
 * Uploads a video to the server.
 * Monitors the upload progress and handles the response upon completion.
 * Displays an error popup and navigates to the home page if the upload fails.
 *
 * @param {FormData} videoData - The video data to be uploaded.
 */
  uploadVideo(videoData: FormData) {
    this.http.post(this.uploadUrl, videoData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === 3) {
          this.getUploadProgress(event);
        } else if (event.type === HttpEventType.Response) {
          this.finishUpload();
        }
      }, error => {
        this.ps.errorPopup('Error by uploading data');
        this.router.navigate(['/home']);
      });
  }


  /**
  * Updates the upload progress percentage.
  *
  * @param {HttpProgressEvent} event - The progress event containing the upload progress information.
  */
  getUploadProgress(event: HttpProgressEvent) {
    let percentDone: number;
    if (event.total) {
      percentDone = Math.round(100 * event.loaded / event.total);
    } else {
      percentDone = event.loaded;
    }
    this.uploadProgress = percentDone;
  }


  /**
  * Handles the completion of the video upload.
  * Displays a success message and navigates to the home page after a delay.
  */
  finishUpload() {
    this.ps.messagePopup('Your video was successfully uploaded. If the video is right, and does not contains any critical contents, it will be published in your home screen soon!');
    setTimeout(() => {
      this.uploadSuccessful = true;
      this.router.navigate(['/home']);
    }, 8000);
  }


  /**
  * Fetches the favorite list for the current user.
  * Sends a POST request with the user ID to retrieve the favorite list.
  * Updates the favorite list length and handles errors if the fetch fails.
  */
  getFavoriteList() {
    const userId = this.auth.currentUser ? this.auth.currentUser()?.id : null;
    if (userId) {
      const data = { user_id: userId };
      this.http.post<FavoriteList>(this.favoriteListUrl, data).pipe(take(1)).subscribe({
        next: data => {
          this.favoriteList = data;
          this.favoriteListLenght = this.favoriteList.favorite_list.favorites.length;
        },
        error: e => {
          this.favoriteList = undefined;
          this.ps.errorPopup('Error by fetching the list');
        },
      });
    }
  }


  /**
 * Updates the favorite list on the server.
 * Sends a PATCH request with the updated favorite list data.
 * Updates the local favorite list and its length upon a successful response.
 * Logs an error if the update request fails.
 */
  updateFavoriteList() {
    if (!this.favoriteList) {
      return;
    }
    const id = this.favoriteList.favorite_list.id;
    const url = this.favoritesUrl + id + '/';
    const data = {
      favorites: this.favoriteList.favorite_list.favorites
    };

    this.http.patch<SimpleFavoriteList>(url, data).pipe(take(1)).subscribe({
      next: data => {
        if (this.favoriteList) {
          this.favoriteList.favorite_list.favorites = data.favorites;
          this.favoriteListLenght = data.favorites.length;
        }
      },
      error: e => {
        this.ps.errorPopup('Error by PUT Request');
      }
    });
  }


}
