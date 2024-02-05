import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { VideoDetailComponent } from '../video-detail/video-detail.component';
import { PopupService } from '../services/popup.service';
import { Video } from '../services/interface';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [VideoDetailComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  @Input() video:Video | undefined;
  img:string = "";

  detail:boolean = false;

  constructor(public popup:PopupService){

  }

  ngOnChanges(changes:SimpleChanges){
    this.img = environment.baseUrl + this.video?.thumbnail;
    
  }

  openVideoDetails() {
    this.popup.videoDetail = this.video;
    this.popup.openPopup();
    }
  
 



}
