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


  /**
 * Resets the password for the email address provided in the email form.
 * 
 * This function first checks if the email form is valid. If it is, it constructs a POST request with the email address to the password reset endpoint. Otherwise, it displays an error message using the `ps.errorPopup` method.
 *
 * @param {object} this - The context object (typically the component instance).
 * @throws {Error} - May throw an error if the email address is invalid or the password reset request fails.
 */
  reset() {
    if (this.emailForm.valid) {
      const url = environment.baseUrl + '/password_reset/';
      const formData = new FormData();
      formData.append('email', this.emailForm.get('email')?.value);
      this.resetPasswordRequest(url, formData);
    } else {
      this.ps.errorPopup('Please fill the field with a valid email adress');
    }
  }


  /**
  * Sends a POST request to the password reset endpoint with the provided email address.
  *
  * This function takes a URL and a FormData object containing the email address. It then:
  *  - Sets a loader indicator to true using `this.auth.loader`.
  *  - Makes a POST request to the URL with the FormData.
  *  - On success, hides the loader, displays a success message using `ps.messagePopup`, and resets the email form.
  *  - On error, hides the loader, and displays an error message using `ps.errorPopup`.
  *
  * @param {string} url - The URL of the password reset endpoint.
  * @param {FormData} formData - A FormData object containing the email address (`email`).
  */
  resetPasswordRequest(url: string, formData: FormData) {
    this.auth.loader.set(true);
    this.http.post(url, formData).subscribe(res => {
      this.auth.loader.set(false);
      this.ps.messagePopup('Please check your mail! We`ve sended you a reset link');
      this.emailForm.reset();
    }, error => {
      this.auth.loader.set(false);
      this.ps.errorPopup('The request to reset your password failed');
    });
  }


  /**
   * Navigates to authentication page
   */
  navigateToLogin() {
    this.route.navigate(['/authentication']);
  }


  /**
   * 
   * @returns true if active form is valid or not.
   */
  isFormValid() {
    const myForm = this.whichFormToUse();
    return myForm?.valid;
  }


  /**
 * Checks if there's a validation error for the email field identified by the provided key.
 *
 * This function takes a key that should correspond to an email field in your form. 
 * It then retrieves the field using `getField` and checks if:
 *  - The field exists.
 *  - There's an "email" validation error within the `errors` property of the field.
 *  - The field is marked as "dirty" (meaning it has been interacted with) and "touched" (meaning it has lost focus).
 *
 * Returns true if all the conditions above are met, indicating an email validation error; otherwise, returns false.
 *
 * @param {string} key - The key that identifies the email field in your form.
 * @returns {boolean} - True if there's an email validation error, false otherwise.
 */
  emailError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['email'] && this.dirtyTouched(field);
    }
  }


  /**
 * Retrieves a specific field from a form based on a provided key.
 *
 * This function first calls `whichFormToUse` to determine the relevant form object.
 * It then attempts to retrieve the field using the provided key from the obtained form object.
 * 
 * If the form exists and the key is valid, the function returns the corresponding field object. Otherwise, it returns undefined.
 *
 * @param {string} key - The key that uniquely identifies the desired field within the form.
 * @returns {object|undefined} - The retrieved field object if found, otherwise undefined.
 */
  getField(key: string) {
    let myForm = this.whichFormToUse();
    let field = myForm?.get(key);
    return field;
  }


  /**
 * Checks if a form field is either dirty or touched.
 *
 * This function takes a form field object as input. A field is considered "dirty" if its value has been changed by the user, and "touched" if the user has interacted with it by focusing and then leaving it.
 *
 * The function returns true if the field is either dirty or touched, or both. Otherwise, it returns false.
 *
 * @param {object} field - The form field object to check.
 * @returns {boolean} - True if the field is dirty or touched, false otherwise.
 */
  dirtyTouched(field: any) {
    return (field.dirty || field.touched);
  }


  /**
 * Checks if a specific field in a form is invalid.
 *
 * This function takes a key that identifies the desired field. It then:
 *  - Calls `getField` to retrieve the corresponding field object.
 *  - If the field exists, it checks if:
 *      - The field is marked as invalid (`field.invalid`).
 *      - The field is either dirty (user-modified) or touched (user-focused).
 *  - Returns true if both conditions above are met, indicating an invalid field with user interaction.
 *  - Otherwise, returns false.
 *
 * @param {string} key - The key that identifies the field in your form.
 * @returns {boolean} - True if the field is invalid and dirty/touched, false otherwise.
 */
  isInvalid(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.invalid && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  /**
 * Checks if a specific field in a form has a valid input.
 *
 * This function takes a key that identifies the desired field. It then:
 *  - Calls `getField` to retrieve the corresponding field object.
 *  - If the field exists, it checks for two conditions:
 *      - The field is not invalid (using `isInvalid`). This ensures it passes all validations.
 *      - The field is marked as valid (`field.valid`).
 *  - Returns true if both conditions above are met, indicating a valid field with a valid value.
 *  - Otherwise, returns false.
 *
 * @param {string} key - The key that identifies the field in your form.
 * @returns {boolean} - True if the field has valid input, false otherwise.
 */
  isValidInput(key: string) {
    const field = this.getField(key);
    if (field) {
      return !this.isInvalid(key) && field.valid;
    } else {
      return false;
    }
  }


  /**
 * Checks if a specific field in a form has a "required" validation error.
 *
 * This function takes a key that identifies the desired field. It then:
 *  - Calls `getField` to retrieve the corresponding field object.
 *  - If the field exists, it checks if:
 *      - The field has a "required" error within its `errors` property.
 *      - The field is either dirty (user-modified) or touched (user-focused).
 *  - Returns true if both conditions above are met, indicating a missing required value with user interaction.
 *  - Otherwise, returns false.
 *
 * @param {string} key - The key that identifies the field in your form.
 * @returns {boolean} - True if the field has a "required" error and is dirty/touched, false otherwise.
 */
  requiredErrors(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['required'] && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  /**
   * Retrieves the form object to be used for validation checks.
   *
   * This function assumes the `emailForm` property holds the form object you want to use for validation. 
   * It simply returns the value of `emailForm`.
   *
   * If you have a more complex logic for determining the form, you can modify this function accordingly.
   *
   * @returns {object} - The form object to be used for validation (in this case, `emailForm`).
   */
  whichFormToUse() {
    let myform = this.emailForm;
    return myform;
  }



}
