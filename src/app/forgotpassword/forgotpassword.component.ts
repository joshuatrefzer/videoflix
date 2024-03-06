import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PopupService } from '../services/popup.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent {
  emailForm: FormGroup;

  constructor(private http: HttpClient, private ps: PopupService, private route: Router, private auth: AuthService) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    if (this.auth.isUserLoggedIn()) {
      this.route.navigate(['/home'])
    }
  }


  reset() {
    if (this.emailForm.valid) {
      const url = environment.baseUrl + '/password_reset/';
      const formData = new FormData();
      formData.append('email', this.emailForm.get('email')?.value);
      this.auth.loader = true;

      this.http.post(url, formData).subscribe(res => {
        this.auth.loader = false;
        this.ps.messagePopup('Please check your mail! We`ve sended you a reset link');
        this.emailForm.reset();
      }, error => {
        this.auth.loader = false;
        this.ps.errorPopup('The request to reset your password failed');
      });
    } else {
      this.ps.errorPopup('Please fill the field with a valid email adress');
    }
  }

  navigateToLogin(){
    this.route.navigate(['/authentication']);
  }

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



  whichFormToUse() {
    let myform = this.emailForm;
    return myform;
  }


}
