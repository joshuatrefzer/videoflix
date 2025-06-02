import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '../services/popup.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent implements OnInit {


  token: string = '';
  newPassword: string = '';

  pwResetForm: FormGroup;

  constructor(private route: ActivatedRoute, private http: HttpClient, public ps: PopupService, private router: Router, private auth: AuthService) {
    this.pwResetForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator.bind(this)]),
      repeatpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    if (this.auth.isUserLoggedIn()) {
      this.router.navigate(['/home'])
    }

  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }


  directToLogin() {
    this.router.navigate(['/authentication']);
  }

  
  getFormData() {
    if (this.isFormValid()) {
      const formData = new FormData();
      formData.append('password', this.pwResetForm.get('password')?.value);
      formData.append('token', this.token);
      return formData;
    } else {
      this.ps.errorPopup('Error by reset your password. Do you have filled all fields correctly?');
      return false;
    }
  }

  resetPassword(): void {
    const url = environment.baseUrl + '/password_reset/confirm/';
    const data = this.getFormData();
    if (!data) return
    this.http.post<any>(url, data).subscribe(response => {
      this.ps.messagePopup('Password reset was successful!');
      this.pwResetForm.reset();
    }, error => {
      this.ps.errorPopup('Your request failed, maybe your token is not vaild anymore.');
      console.error(error);
    });
  }

  isFormValid() {
    const myForm = this.whichFormToUse();
    return myForm?.valid;
  }

  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const valid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    return valid ? null : { 'invalidPassword': true };
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
    return (field.dirty || field.touched);
  }

  isInvalid(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.invalid && this.dirtyTouched(field);
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
      return field.errors?.['required'] && this.dirtyTouched(field);
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
    const repeatedPW = this.pwResetForm.get(repeat)?.value;
    const password = this.pwResetForm.get(pw)?.value;
    if (repeatedPW && password) {
      return repeatedPW === password && repeatedPW.length > 1;
    } else {
      return false;
    }
  }

  whichFormToUse() {
    let myform = this.pwResetForm;

    return myform;
  }

}
