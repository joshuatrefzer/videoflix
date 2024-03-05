import { Component } from '@angular/core';
import { SearchService } from '../services/search.service';
import { VideoComponent } from '../video/video.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';


@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    imports: [VideoComponent, CommonModule, LoaderComponent]
})
export class SearchComponent {

  constructor(public searchService: SearchService){

  }

}
