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
  value:string = '';

  search(searchValue: string) {

    const url = environment.baseUrl + '/api/videos/search/';
    this.value = searchValue;
    const data = {
      search_title: searchValue,
    };
    this.http.post<Video[]>(url, data).subscribe((response) => {
      this.searchResult = response;
    }, (error) => {
      this.ps.errorPopup(`Error by searching "${searchValue}"`);
    });
  }




}
