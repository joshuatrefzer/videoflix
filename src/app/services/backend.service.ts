import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable, filter } from 'rxjs';
import { error } from 'console';
import { Video, VideoGenre } from './interface';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  videoUrl = environment.baseUrl + '/api/videos/';
  videos: Video[] = [];

  constructor(private http: HttpClient) { }

  fetchVideoData() {
    if (this.isNecessary()) {
      this.getVideos().subscribe((data: Video[]) => {
        this.videos = data;
        console.log(this.videos);
      }, error => {
        console.log('Error by loading data from backend');
      })
    }
  }

  isNecessary() {
    return this.videos.length === 0;
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



  uploadVideo() {

  }








}
