import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';

import { Observable, filter, take } from 'rxjs';
import { FavoriteList, Video, VideoGenre } from './interface';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';
import { AuthService } from './auth.service';
import { error, log } from 'console';



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

  constructor(private http: HttpClient, private router: Router, private ps: PopupService, private auth: AuthService) { }

  fetchVideoData() {
    this.getVideos().pipe(take(1)).subscribe(
      {
        next: (data: Video[]) => {
          this.videos = data;
          this.auth.loader = false;
        },
        error: error => {
          this.auth.loader = true;
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
      filteredVideos = []
    }
    return filteredVideos;
  }


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


  getUploadProgress(event: HttpProgressEvent) {
    let percentDone: number;
    if (event.total) {
      percentDone = Math.round(100 * event.loaded / event.total);
    } else {
      percentDone = event.loaded;

    }
    this.uploadProgress = percentDone;
  }

  finishUpload() {
    this.ps.messagePopup('Your video was successfully uploaded. If the video is right, and does not contains any critical contents, it will be published in your home screen soon!');
    setTimeout(() => {
      this.uploadSuccessful = true;
      this.router.navigate(['/home']);
    }, 8000);
  }


  getFavoriteList() {
    const userId = this.auth.currentUser ? this.auth.currentUser.id : null;
    if (userId) {
      const data = { user_id: userId };
      this.http.post<FavoriteList>(this.favoriteListUrl, data).pipe(take(1)).subscribe({
        next: data => {
          this.favoriteList = data;
        },
        error: e => {
          this.favoriteList = undefined;
          console.log('Error by fetching the list', e);
        },
      });
    }
  }

  updateFavoriteList() {
    if (!this.favoriteList) {
      return;
    }
    const id = this.favoriteList.favorite_list.id;
    const url = this.favoritesUrl + id + '/';
    const data = {
      favorites: this.favoriteList.favorite_list.favorites
    }
  
    this.http.patch(url, data).pipe(take(1)).subscribe({
      next: data => {
        console.log(data);
        

      },
      error: e => {
        console.log('error by put request', e);
      }

    })
  }









}
