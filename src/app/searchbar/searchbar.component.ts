import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { PopupService } from '../services/popup.service';
import { Video } from '../services/interface';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})

export class SearchbarComponent {
  isSearchExpanded = false;
  hide: boolean = false;
  count: number = 0;
  searchValue: string = '';

  constructor(private router: Router, private http: HttpClient, private ps: PopupService, private searchService: SearchService) {

  }

  /**
 * Toggles the search state to expanded and initializes the counter.
 */
  toggleSearch() {
    this.isSearchExpanded = true;
    this.count = 0;
    this.startCount();
  }

  /**
  * Starts a counter that increments every second.
  * When the counter exceeds 4, the variables are reset.
  */
  startCount() {
    const intervalId = setInterval(() => {
      this.count++;
      if (this.count > 4) {
        this.resetVar();
        clearInterval(intervalId);
      }
    }, 1000);
  }

  /**
  * Resets the variables related to the search state.
  * Hides the search for a brief period before collapsing it.
  */
  resetVar() {
    this.hide = true;
    setTimeout(() => {
      this.isSearchExpanded = false;
      this.hide = false;
      this.count = 0;
    }, 300);
  }

  /**
  * Starts the search process.
  * If the search value length is greater than or equal to 1, navigates to the search page and initiates the search.
  * Otherwise, navigates to the home page.
  */
  startSearch() {
    console.log(this.searchValue);
    this.count = 0;
    if (this.searchValue.length >= 1) {
      this.router.navigate(['/search']);
      this.search();
    } else {
      this.router.navigate(['/home']);
    }
  }

  /**
  * Executes the search operation using the search service.
  * Converts the search value to lowercase before searching.
  */
  search() {
    this.searchService.search(this.searchValue.toLowerCase());
  }



}
