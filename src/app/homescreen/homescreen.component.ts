import { Component } from '@angular/core';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'app-homescreen',
  standalone: true,
  imports: [VideoComponent],
  templateUrl: './homescreen.component.html',
  styleUrl: './homescreen.component.scss'
})
export class HomescreenComponent {

}
