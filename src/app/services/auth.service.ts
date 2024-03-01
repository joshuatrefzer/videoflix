import { Injectable } from '@angular/core';
import { User } from './interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { error } from 'console';
import { PopupService } from './popup.service';


interface LoginResponse {
  token: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private ps:PopupService) { }

  userisLoggedIn = false;
  currentUser: User | undefined;


  url = environment.baseUrl;

  loader: boolean = false;
  mailSendFeedback: boolean = false;

  signUp(userData: FormData) {
    this.loader = true;
    const url = this.url + '/users/register/';
    this.http.post(url, userData).subscribe(response => {
      console.log(response);
      if (response) {
        this.loader = false;
        this.mailSendFeedback = true;
      }
    }, error => {
      if(error.status === 404) 
      this.ps.errorPopup('No valid data, please fill every field with correct data');
      this.loader = false;
    });
  }

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
      if(error.status === 404) 
      this.ps.errorPopup('Wrong password or email. Do you have already an account?');
      this.loader = false;
    });
  }

  logOut() {
    this.loader = true;
    const url = this.url + '/users/logout/';
    this.http.post(url, '').subscribe(r => {
      this.resetData();
    }, error => {
      console.log('Not successfully logged out');
    });
  }


  deleteUser() {
    const url = this.url + '/users/delete/';
    this.http.post(url, '').subscribe(response => {
      this.resetData();
    }, error => {
      console.log('User not deleted successfully');

    });
  }

  resetData() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser = undefined;
    this.userisLoggedIn = false;
    this.router.navigate(['/authentication']);
    this.loader = false;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUser(user: object) {
    const userToString = JSON.stringify(user);
    localStorage.setItem('currentUser', userToString);
  }

  isUserLoggedIn() {
    return this.getToken() !== false && this.getCurrentUser() !== false;
  }

  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return false;
    else {
      const user = JSON.parse(userString);
      return user;
    }
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      return false;
    }
  }




}
