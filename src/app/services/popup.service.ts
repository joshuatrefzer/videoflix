import { Injectable } from '@angular/core';
import { Video } from './interface';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  bg:boolean = false;
  videoDetail: Video | undefined;


  openPopup(){
    this.bg = true;
  }


  closePopups(){
    this.bg = false;
  }
  
}
