import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable, filter, firstValueFrom, take } from 'rxjs';
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
  uploadSuccessful: boolean = false;

  favoriteListLenght: number = 0;

  constructor(private http: HttpClient, private router: Router, private ps: PopupService, private auth: AuthService) { }

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

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.videoUrl);
  }

  filterVideos(genreToFilter: VideoGenre): Video[] {
    let filteredVideos: Video[];
    if (genreToFilter) {
      filteredVideos = this.videos.filter(video => video.genre === genreToFilter);
    } else {
      filteredVideos = [];
    }
    return filteredVideos;
  }

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

  async uploadVideo(videoData: FormData) {
    try {
      await firstValueFrom(this.http.post(this.uploadUrl, videoData));
      this.finishUpload();
    } catch (error) {
      this.ps.errorPopup('Error by uploading data');
      this.router.navigate(['/home']);
    }
  }

  finishUpload() {
    this.ps.messagePopup('Your video was successfully uploaded. If the video is right, and does not contains any critical contents, it will be published in your home screen soon!');
    setTimeout(() => {
      this.uploadSuccessful = true;
      this.router.navigate(['/home']);
    }, 8000);
  }


  getFavoriteList() {
    const userId = this.getUserId();
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

  getUserId() {
    return this.auth.currentUser ? this.auth.currentUser?.id : null;
  }

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
