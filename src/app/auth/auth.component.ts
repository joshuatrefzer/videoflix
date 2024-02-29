import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent {

  directTo: "signUp" | "login" = "login";
  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(public as: AuthService, private router: Router, private formBuilder: FormBuilder, public ps: PopupService) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatpassword: ['', Validators.required],
    });
  }

  logIn() {
    const userData = new FormData();
    userData.append('email' , this.loginForm.get('email')?.value);
    userData.append('password' , this.loginForm.get('password')?.value);
    this.as.login(userData);
  }

  signUp(){
    if (this.signUpForm.valid) {
      const formData = new FormData();
      formData.append('first_name' , this.signUpForm.get('firstname')?.value);
      formData.append('last_name' , this.signUpForm.get('lastname')?.value);
      formData.append('email' , this.signUpForm.get('email')?.value);
      formData.append('password' , this.signUpForm.get('password')?.value);

      this.as.signUp(formData);
    }
    
  }


  direct(key:"signUp" | "login"){
    this.directTo = key;
    this.loginForm.reset();
    this.signUpForm.reset();
  }



  // ******  FORM VALIDATION ******

  isFormValid() {
    const myForm = this.whichFormToUse()
    return myForm?.valid;
  }

  checkForValidation(key: string) {
    let myForm = this.whichFormToUse();
    return myForm?.get(key)?.invalid &&
      (myForm.get(key)?.dirty ||
        myForm.get(key)?.touched);
  }

  checkForLength(key:string , length:number){
    let myForm = this.whichFormToUse();
    const currentField = myForm?.get(key)?.value;
    if (currentField) {
      return currentField.length > length;
    }
    return;
  }

  emailIsValid(key: string): boolean {
    const form = this.whichFormToUse();
    const email = form?.get(key)?.value;
  
      if (!email) return false;
      const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!basicFormatRegex.test(email)) return false;
      return true;
  }

  passwordRepeat(repeat:string , pw:string){
    const repeatedPW= this.signUpForm.get(repeat)?.value;
    const password= this.signUpForm.get(pw)?.value;
    if (repeatedPW && password) {
      return repeatedPW === password && password.length > 5;
    } else {
      return;
    }
    
  }

  whichFormToUse() {
    let myform;
    if (this.directTo === "login") {
      myform = this.loginForm;
    } else if (this.directTo === "signUp") {
      myform = this.signUpForm
    }
    return myform;
  }

  isDirty(key: string) {
    return this.loginForm.get(key)?.dirty;
  }

  redirect(){
    this.as.mailSendFeedback = false;
    this.directTo = 'login';
  }

}
