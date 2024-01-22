import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

directTo: "signUp" | "login" = "login"; 

constructor(public as: AuthService, private router: Router){

}

logIn(){
  this.as.userisLoggedIn = true;
  this.router.navigate(['/home'])

}




}
