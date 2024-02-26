import { Injectable } from '@angular/core';
import { User } from './interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  userisLoggedIn = false;
  url = environment.baseUrl + '/users/register/';

  loader:boolean =false;
  mailSendFeedback:boolean = false;

  signUp(userData:FormData){
    this.loader = true;
    this.http.post(this.url, userData).subscribe(response => {
      console.log(response);
      if (response) {
        this.loader = false;
        this.mailSendFeedback = true;
      }
    }, error => {
      console.log('registration failed' , error);
    });
  }

  login(userData:FormData){

  }



}
