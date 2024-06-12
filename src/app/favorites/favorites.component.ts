import { Component, OnInit } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  constructor(private ps: PopupService, private http: HttpClient, private backendService: BackendService) {
    this.ps.activeLink = '/favorites';
  }


  ngOnInit(): void {
    this.getList();
  }


  getList() {
    const url = environment.baseUrl + '/favorites/';
    this.http.get(url).pipe(take(1)).subscribe(response => {
      console.log(response);
    })
  }

}
