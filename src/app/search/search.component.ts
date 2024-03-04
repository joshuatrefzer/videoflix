import { Component } from '@angular/core';
import { SearchService } from '../services/search.service';
import { VideoComponent } from '../video/video.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [VideoComponent, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  constructor(public searchService: SearchService){

  }

}
