import { Injectable } from '@angular/core';
import { User } from './interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';
import { log } from 'node:console';
import { tap } from 'rxjs';


interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private ps: PopupService) { }

  userisLoggedIn = false;
  currentUser: User | undefined;
  isGuest: boolean = false;

  guestUser: User = {
    id: 49,
    firstname: "guest",
    lastname: "user",
    email: "videofix.joshuatrefzer@mailinator.com",
    password: "Testpassword123"
  }

  url = environment.baseUrl;
  loader: boolean = false;
  mailSendFeedback: boolean = false;


  /**
 * Handles the user sign-up process.
 * Sends a POST request to the server with the user data.
 * Displays a loader during the request and provides feedback based on the response.
 *
 * @param {FormData} userData - The user data to be sent in the request.
 */
  signUp(userData: FormData) {
    this.loader = true;
    const url = this.url + '/users/register/';
    this.http.post(url, userData).subscribe(response => {
      if (response) {
        this.loader = false;
        this.mailSendFeedback = true;
      }
    }, error => {
      if (error.status === 404) {
        this.ps.errorPopup('No valid data, please fill every field with correct data');
      } else {
        this.ps.errorPopup('Something went wrong..');
      }
      this.loader = false;
    });
  }


  /**
 * Handles the user login process.
 * Sends a POST request to the server with the user data.
 * Displays a loader during the request and provides feedback based on the response.
 * On successful login, stores the token and user information, and navigates to the home page.
 *
 * @param {FormData} userData - The user data to be sent in the request.
 */
  login(userData: FormData) {
    this.loader = true;
    const url = this.url + '/users/login/';
    this.http.post<LoginResponse>(url, userData).subscribe(response => {
      if (response && response.token) {
        this.setToken(response.token);
        this.setUser(response.user);
        this.userisLoggedIn = true;
        this.router.navigate(['/home']);
        this.loader = false;
      }
    }, error => {
      this.loader = false;
      if (error.status === 404) {
        this.ps.errorPopup('Wrong password or email. Do you have already an account?');
      } else if (error.status === 400) {
        this.ps.errorPopup("Please activate your account before login. Please check your mail.");
      }
    });
  }


  /**
 * Logs the user out.
 * Displays a loader during the request.
 * If the user is a guest, resets the user data directly.
 * Otherwise, sends a POST request to log out the user on the server and then resets the user data.
 */
  logOut() {
    this.loader = true;
    if (this.isGuestUser()) {
      this.resetData();
    } else {
      const url = this.url + '/users/logout/';
      this.http.post(url, '').subscribe(r => {
        this.resetData();
      }, error => {
        this.ps.errorPopup('Not successfully logged out');
      });
    }
  }

  /**
  * Checks if the current user is a guest user.
  * Sets the `isGuest` flag to true if the user is a guest.
  */
  checkForGuestUser() {
    if (this.isGuestUser()) {
      this.isGuest = true;
    }
  }

  /**
  * Determines if the current user is a guest user.
  * Compares the current user's email and firstname with the guest user's email and firstname.
  *
  * @returns {boolean} True if the current user is a guest user, otherwise false.
  */
  isGuestUser() {
    this.getCurrentUser();
    return this.currentUser?.email === this.guestUser?.email &&
      this.currentUser?.firstname === this.guestUser?.firstname;
  }

  /**
  * Deletes the user account.
  * Sends a POST request to the server to delete the user.
  * Resets the user data upon successful deletion.
  * Displays an error popup if the user deletion is not successful.
  */
  deleteUser() {
    const url = this.url + '/users/delete/';
    this.http.post(url, '').subscribe(response => {
      this.resetData();
    }, error => {
      this.ps.errorPopup('User not deleted successfully');
    });
  }


  /**
 * Resets the user data.
 * Removes the token and current user data from local storage.
 * Sets the current user to undefined and updates the login status.
 * Navigates to the authentication page and hides the loader.
 */
  resetData() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser = undefined;
    this.userisLoggedIn = false;
    this.router.navigate(['/authentication']);
    this.loader = false;
  }


  /**
  * Sets the authentication token in local storage.
  *
  * @param {string} token - The authentication token to be stored.
  */
  setToken(token: string) {
    localStorage.setItem('token', token);
  }


  /**
  * Sets the current user data in local storage.
  *
  * @param {object} user - The user object to be stored.
  */
  setUser(user: object) {
    const userToString = JSON.stringify(user);
    localStorage.setItem('currentUser', userToString);
  }


  /**
  * Checks if a user is currently logged in.
  *
  * @returns {boolean} True if a user is logged in, otherwise false.
  */
  isUserLoggedIn() {
    return this.getToken() !== false && this.getCurrentUser() !== false;
  }


  /**
  * Retrieves the current user data from local storage.
  * Parses and returns the user object if it exists, otherwise returns false.
  *
  * @returns {object|boolean} The current user object if it exists, otherwise false.
  */
  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return false;
    else {
      const user = JSON.parse(userString);
      this.currentUser = user;
      return user;
    }
  }


  /**
  * Retrieves the authentication token from local storage.
  *
  * @returns {string|boolean} The token if it exists, otherwise false.
  */
  getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      return false;
    }
  }


}
