import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoGenre, genres } from '../services/interface';
import { BackendService } from '../services/backend.service';
import { PopupService } from '../services/popup.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatProgressBarModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  selectedVideo: File | undefined;
  selectedThumbnail: File | undefined;
  movieForm: FormGroup;

  errorVideo: string | undefined;
  errorThumb: string | undefined;
  errorSubmit: string | undefined;
  genres: VideoGenre[];

  inputFinished: boolean = false;


  constructor(private formBuilder: FormBuilder, public bs: BackendService, public ps: PopupService) {
    this.movieForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(4)]),
      genre: new FormControl('', [Validators.required]),
      actors: new FormControl('', [Validators.required, Validators.minLength(4)]),
      description: new FormControl('', [Validators.required, Validators.minLength(15)]),
    });
    this.genres = genres;
    this.ps.activeLink = '/upload';
  }


  /**
 * Handles the selection of a video file.
 * @param {any} event - The event object triggered by the file selection.
 */
  onVideoSelected(event: any): void {
    /**
     * The selected file.
     * @type {File}
     */
    const file: File = event.target.files[0];
    if (file) {
      /**
       * The type of the selected file.
       * @type {string}
       */
      const fileType = file.type;

      if (fileType === 'video/mp4') {
        this.selectedVideo = file;
        this.errorVideo = undefined;
      } else {
        this.errorVideo = "Please select a valid video format (mp4, mov)";
        this.selectedVideo = undefined;
        event.target.value = null;
      }
    }
  }


  /**
 * Handles the selection of a thumbnail image file.
 * @param {any} event - The event object triggered by the file selection.
 */
  onThumbnailSelected(event: any): void {
    /**
     * The selected file.
     * @type {File}
     */
    const file: File = event.target.files[0];
    if (file) {
      if (this.checkForFormat(file)) {
        this.selectedThumbnail = file;
        this.errorThumb = undefined;
      } else {
        this.errorThumb = "Please select a valid image file (jpeg, png)";
        this.selectedThumbnail = undefined;
      }
    }
  }


  /**
 * Checks if the selected file is in a valid image format (JPEG or PNG).
 * @param {File} file - The file to be checked.
 * @returns {boolean} - Returns true if the file format is valid (JPEG or PNG), otherwise false.
 */
  checkForFormat(file: File): boolean {
    return file.type === 'image/jpeg' || file.type === 'image/png';
  }


  /**
 * Submits the movie form if all required fields are filled with valid data.
 * If successful, uploads the video and thumbnail files.
 * If any required fields are missing or contain invalid data, displays an error message.
 */
  onSubmit(): void {
    if (this.selectedThumbnail && this.selectedVideo && this.isFormValid()) {
      const formData = new FormData();
      formData.append('title', this.movieForm.get('title')?.value);
      formData.append('actors', this.movieForm.get('actors')?.value);
      formData.append('description', this.movieForm.get('description')?.value);
      formData.append('genre', this.movieForm.get('genre')?.value);
      formData.append('thumbnail', this.selectedThumbnail);
      formData.append('video_file', this.selectedVideo);
      this.resetFields();
      this.bs.uploadVideo(formData);
    } else {
      this.ps.errorPopup('Please fill all fields with valid data. Are you using the correct video and image formats?');
    }
  }


  /**
 * Checks if the movie form is valid and both the thumbnail and video are selected.
 * @returns {boolean} - Returns true if the form is valid and both the thumbnail and video are selected, otherwise false.
 */
  isFormValid() {
    return this.movieForm.valid && this.selectedThumbnail && this.selectedVideo;
  }


  /**
 * Resets the movie form and sets the inputFinished flag to true.
 */
  resetFields(): void {
    this.movieForm.reset();
    this.inputFinished = true;
  }


  /**
 * Retrieves a form field by its key.
 * @param {string} key - The key of the field to retrieve.
 * @returns Returns the form field if found, otherwise null.
 */
  getField(key: string) {
    let myForm = this.movieForm;
    let field = myForm?.get(key);
    return field;
  }


  /**
 * Checks if a form field is dirty or touched.
 * @param {any} field - The form field to check.
 * @returns {boolean} - Returns true if the field is dirty or touched, otherwise false.
 */
  dirtyTouched(field: any): boolean {
    return field.dirty || field.touched;
  }


  /**
   * Checks if a form field is invalid.
   * @param {string} key - The key of the form field to check.
   * @returns {boolean} - Returns true if the field is invalid and dirty/touched, otherwise false.
   */
  isInvalid(key: string): boolean {
    const field = this.getField(key);
    if (field) {
      return field.invalid && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  /**
 * Checks if a form field has valid input.
 * @param {string} key - The key of the form field to check.
 * @returns {boolean} - Returns true if the field has valid input, otherwise false.
 */
  isValidInput(key: string): boolean {
    const field = this.getField(key);
    if (field) {
      return !this.isInvalid(key) && field.valid;
    } else {
      return false;
    }
  }



  /**
 * Checks if a required field has errors.
 * @param {string} key - The key of the form field to check.
 * @returns {boolean} - Returns true if the required field has errors and is dirty/touched, otherwise false.
 */
  requiredErrors(key: string): boolean {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['required'] && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  /**
 * Retrieves the minimum length error of a form field.
 * @param {string} key - The key of the form field to check.
 * @returns {ValidationErrors | null} - Returns the minimum length error if present, otherwise null.
 */
  minLengthError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['minlength'];
    } else {
      return null;
    }
  }
}
