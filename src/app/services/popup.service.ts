import { Injectable } from '@angular/core';
import { Video } from './interface';

@Injectable({
  providedIn: 'root'
})
export class PopupService {


  constructor() { }
  errorMessage: string | undefined;
  bg: boolean = false;
  videoDetail: Video | undefined;
  userPopup: boolean = false;
  message: string | undefined;
  isMobile: boolean = false;
  activeLink: string = '';
  errorTimeout: any;

  /**
 * Opens the background popup.
 * Sets the background visibility to true.
 */
  openPopup() {
    this.bg = true;
  }


  /**
  * Displays an error popup with the given message.
  * Opens the popup and sets the error message.
  * Closes the popup automatically after 3 seconds.
  *
  * @param {string} message - The error message to be displayed.
  */
  errorPopup(message: string) {
    this.openPopup();
    this.errorMessage = message;
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = undefined;
      this.closePopups();
    }, 3000);
  }


  /**
  * Stops the error timeout to prevent the error message from disappearing.
  */
  stopErrorTimeout() {
    clearTimeout(this.errorTimeout);
  }


  /**
  * Displays a message popup with the given message.
  * Opens the popup and sets the message.
  * Closes the popup automatically after 3 seconds.
  *
  * @param {string} message - The message to be displayed.
  */
  messagePopup(message: string) {
    this.openPopup();
    this.message = message;
    setTimeout(() => {
      this.message = undefined;
      this.closePopups();
    }, 8000);
  }


  /**
  * Closes all popups.
  * Resets the background and user popup visibility.
  * Clears the error message and stops any running error timeout.
  */
  closePopups() {
    this.bg = false;
    this.userPopup = false;
    this.errorMessage = undefined;
    this.stopErrorTimeout();
  }


}
