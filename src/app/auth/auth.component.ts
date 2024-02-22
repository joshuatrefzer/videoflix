import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  directTo: "signUp" | "login" = "login";
  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(public as: AuthService, private router: Router, private formBuilder: FormBuilder) {
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
    this.as.userisLoggedIn = true;
    this.router.navigate(['/home'])
  }

  isFormValid() {
    return this.loginForm.valid;
  }

  checkForValidation(key: string) {
    let myForm = this.whichFormToUse();
    return myForm?.get(key)?.invalid &&
      (myForm.get(key)?.dirty ||
        myForm.get(key)?.touched);
  }

  emailIsValid(key: string): boolean {
    const form = this.whichFormToUse();
    const email = form?.get(key)?.value;
  
      if (!email) return false;
      const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!basicFormatRegex.test(email)) return false;
      return true;
    /// TODO -> IN Sign Up ebenfalls einsetzen! 
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




}
