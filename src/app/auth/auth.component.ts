import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { PopupService } from '../services/popup.service';
import { User } from '../services/interface';

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

  constructor(public as: AuthService, private router: Router, private formBuilder: FormBuilder, public ps: PopupService) {

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    this.signUpForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(4)],),
      lastname: new FormControl('', [Validators.required, Validators.minLength(4)],),
      email: new FormControl('', [Validators.required, Validators.email],),
      password: new FormControl('', [Validators.required, Validators.minLength(8)],),
      repeatpassword: new FormControl('', [Validators.required, Validators.minLength(8)],),
    });

    if (this.as.isUserLoggedIn()) this.router.navigate(['/home']);
  }


  guestLogin() {
    const userData = {
      email: this.as.guestUser.email,
      password: this.as.guestUser.password
    };
    if (this.as.guestUser.password) {
      this.as.login(userData);
    }
  }

  private getLoginFormData(): Partial<User>{
     const userData = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    return userData;
  }

  logIn() {
    if (this.loginForm.valid) {
      const userData = this.getLoginFormData();
      this.as.login(userData);
    } else {
      this.ps.errorPopup('please fill all fields with valid data');
    }
  }


  signUp() {
    if (this.signUpForm.valid) {
      const data = this.getSignupFormData();
      this.as.signUp(data);
    } else {
      this.ps.errorPopup('please fill all fields with valid data');
    }
  }

  getSignupFormData(): Partial<User> {
    const data = {
      first_name: this.signUpForm.get('firstname')?.value,
      last_name: this.signUpForm.get('lastname')?.value,
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value,
      username: this.signUpForm.get('firstname')?.value + '_' + this.signUpForm.get('lastname')?.value
    }
    return data;
  }


  forgotPW() {
    this.router.navigate(['/forgotpassword']);
  }

  direct(key: "signUp" | "login") {
    this.directTo = key;
    this.loginForm.reset();
    this.signUpForm.reset();
  }



  // ******  FORM VALIDATION ******
  isFormValid() {
    const myForm = this.whichFormToUse();
    return myForm?.valid;
  }

  emailError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['email'] && this.dirtyTouched(field);
    }
  }

  getField(key: string) {
    let myForm = this.whichFormToUse();
    let field = myForm?.get(key);
    return field;
  }

  dirtyTouched(field: any) {
    return (field.dirty ||
      field.touched);
  }

  isInvalid(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.invalid &&
        this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  isValidInput(key: string) {
    const field = this.getField(key);
    if (field) {
      return !this.isInvalid(key) && field.valid;
    } else {
      return false;
    }
  }


  requiredErrors(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['required'] &&
        this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  minLengthError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['minlength'];
    } else {
      return false;
    }
  }


  passwordRepeat(repeat: string, pw: string) {
    const repeatedPW = this.signUpForm.get(repeat)?.value;
    const password = this.signUpForm.get(pw)?.value;
    if (repeatedPW && password) {
      return repeatedPW === password && repeatedPW.length > 1;
    } else {
      return false;
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

  redirect() {
    this.as.mailSendFeedback.set(false);
    this.directTo = 'login';
  }

}
