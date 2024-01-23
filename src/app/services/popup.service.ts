import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  bg:boolean = false;
  videoDetail: number | undefined;


  openPopup(){
    this.bg = true;
  }


  closePopups(){
    this.bg = false;
  }
  
}
