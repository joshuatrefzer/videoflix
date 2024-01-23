import { Component, Input } from '@angular/core';
import { VideoDetailComponent } from '../video-detail/video-detail.component';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [VideoDetailComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  @Input() video:number = 0;

  detail:boolean = false;

  constructor(public popup:PopupService){

  }


  openVideoDetails() {
    this.popup.videoDetail = this.video;
    this.popup.openPopup();
    }
  
 



}
