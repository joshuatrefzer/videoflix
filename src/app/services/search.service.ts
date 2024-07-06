import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Video } from './interface';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {


  constructor(private http: HttpClient, private ps: PopupService) { }
  searchResult: Video[] = [];
  value: string = '';
  loader: boolean = false;

  /**
 * Searches for videos based on the provided search value.
 * Sends a POST request with the search title to the server.
 * Updates the search results and hides the loader upon a successful response.
 * Displays an error popup if the search request fails.
 *
 * @param {string} searchValue - The value to search for.
 */
  search(searchValue: string) {
    this.loader = true;
    const url = environment.baseUrl + '/api/videos/search/';
    this.value = searchValue;
    const data = {
      search_title: searchValue,
    };
    this.http.post<Video[]>(url, data).subscribe((response) => {
      this.searchResult = response;
      this.loader = false;
    }, (error) => {
      this.ps.errorPopup(`Error by searching "${searchValue}"`);
    });
  }


}
