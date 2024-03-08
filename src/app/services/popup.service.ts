import { Injectable } from '@angular/core';
import { Video } from './interface';

@Injectable({
  providedIn: 'root'
})
export class PopupService {


  constructor() { }
  errorMessage:string | undefined;
  bg:boolean = false;
  videoDetail: Video | undefined;
  userPopup:boolean = false;
  message:string | undefined;
  isMobile:boolean = false;
  activeLink: string = ''; 

  openPopup(){
    this.bg = true;
  }

  

  errorPopup(message:string){
    this.openPopup();
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = undefined;
      this.closePopups();
    }, 3000);
  }

  messagePopup(message:string){
    this.openPopup();
    this.message = message;
    setTimeout(() => {
      this.message = undefined;
      this.closePopups();
    }, 3000);
  }


  closePopups(){
    this.bg = false;
    this.userPopup = false;
    this.errorMessage = undefined;
  }
  
}
