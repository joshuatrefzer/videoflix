import { Injectable, signal } from '@angular/core';
import { User } from './interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';
import { firstValueFrom } from 'rxjs';


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

  url:string = environment.baseUrl;
  userisLoggedIn = signal<boolean>(false);
  currentUser: User | undefined;
  isGuest = signal<boolean>(false);
  loader = signal<boolean>(false);
  mailSendFeedback = signal<boolean>(false);


  guestUser: User = {
    id: 49,
    firstname: "guest",
    lastname: "user",
    email: "videofix.joshuatrefzer@mailinator.com",
    password: "Testpassword123"
  }

  constructor(private http: HttpClient, private router: Router, private ps: PopupService) { }


  async signUp(userData: Partial<User>) {
    this.loader.set(true);
    const url = this.url + '/users/register/';
  
    try {
      const response = await firstValueFrom(this.http.post(url, userData));
  
      if (response) {
        this.mailSendFeedback.set(true);
      }
    } catch (error: any) {
      if (error.status === 404) {
        this.ps.errorPopup('No valid data, please fill every field with correct data');
      } else {
        this.ps.errorPopup('Something went wrong..');
      }
    } finally {
      this.loader.set(false);
    }
  }

  async login(userData:Partial<User>) {
    this.loader.set(true);
    const url = this.url + '/users/login/';
  
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(url, userData)
      );
  
      if (response?.token) {
        this.setToken(response.token);
        this.setUser(response.user);
        this.userisLoggedIn.set(true);
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      if (error.status === 404) {
        this.ps.errorPopup('Wrong password or email. Do you have already an account?');
      } else if (error.status === 400) {
        this.ps.errorPopup("Please activate your account before login. Please check your mail.");
      }
    } finally {
      this.loader.set(false);
    }
  }


  public async logOut() {
    this.loader.set(true);
    if (this.isGuestUser()) {
      this.resetData();
    } else {
      await this.sendLogoutRequest();
    }
  }

  async sendLogoutRequest(){
    const url = this.url + '/users/logout/';
    try {
      await firstValueFrom(this.http.post(url, ''));
    } catch (error) {
      this.ps.errorPopup('Not successfully logged out');
    }
    this.loader.set(false);
    this.router.navigate(['/authentication']);
  }

  public checkForGuestUser() {
    if (this.isGuestUser()) {
      this.isGuest.set(true);
    }
  }

  private isGuestUser() {
    this.getCurrentUser();
    return this.currentUser?.email === this.guestUser?.email &&
      this.currentUser?.firstname === this.guestUser?.firstname;
  }

  async deleteUser(){
    const url = this.url + '/users/delete/';
    try {
      const response = firstValueFrom(this.http.post(url, ''));
      this.resetData();
    } catch (error) {
      this.ps.errorPopup('User not deleted successfully');
    }
  }

  private resetData() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser = undefined;
    this.userisLoggedIn.set(false);
    this.router.navigate(['/authentication']);
    this.loader.set(false);
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  private setUser(user: object) {
    const userToString = JSON.stringify(user);
    localStorage.setItem('currentUser', userToString);
  }

  public isUserLoggedIn() {
    return this.getToken() !== false && this.getCurrentUser() !== false;
  }

  private getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return false;
    else {
      const user = JSON.parse(userString);
      this.currentUser = user;
      return user;
    }
  }

  private getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      return false;
    }
  }


}
