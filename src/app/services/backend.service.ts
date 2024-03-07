import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpEventType, HttpProgressEvent } from '@angular/common/http';

import { Observable, filter } from 'rxjs';
import { error } from 'console';
import { Video, VideoGenre } from './interface';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';



@Injectable({
  providedIn: 'root'
})
export class BackendService {
  videoUrl = environment.baseUrl + '/api/videos/';
  uploadUrl = environment.baseUrl + '/api/upload/'
  videos: Video[] = [];
  uploadProgress: number = 0;
  uploadSuccessful: boolean = false;

  constructor(private http: HttpClient, private router: Router, private ps: PopupService) { }

  fetchVideoData() {
    this.getVideos().subscribe((data: Video[]) => {
      this.videos = data;
      console.log(this.videos);
    }, error => {
      this.ps.errorPopup('Error by loading data from backend');
    });
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
        console.log('error by uploading data', error);
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
    setTimeout(() => {
      this.uploadSuccessful = true;
      this.router.navigate(['/home']);
    }, 1500);
  }










}
