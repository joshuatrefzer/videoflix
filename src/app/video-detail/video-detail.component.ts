import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { environment } from '../../environments/environment.development';


@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss'
})
export class VideoDetailComponent implements OnInit, OnDestroy{


  constructor(public ps:PopupService, private elementRef: ElementRef){}
  
  thumb:string = "";
  video:string = "";
  resolution: boolean = false;




  ngOnInit(): void {
      this.thumb = environment.baseUrl + this.ps.videoDetail?.thumbnail;
      this.video = environment.baseUrl + this.ps.videoDetail?.video_file;
  }

  ngOnDestroy(): void {
      this.ps.videoDetail = undefined;
  }

  changeResolution(path:string , event:MouseEvent){
    //Video Path zusammenfügen mit Parameter

    event.stopPropagation();
    this.resolution = false;

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
  

}
