import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import videojs from 'video.js';
import { Video } from '../services/interface';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnChanges, AfterViewInit {

  @Input() video: string | undefined;
  @Input() thumb: string | undefined;

  videoPlayer: any;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.video);
  }

  ngAfterViewInit() {
    this.videoPlayer = videojs(this.elementRef.nativeElement.querySelector('video'));
  }

  ngOnDestroy() {
    if (this.videoPlayer) {
      this.videoPlayer.dispose();
    }
  }
}
