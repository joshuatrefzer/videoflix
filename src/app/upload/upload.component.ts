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
  uploadProgress: number = 0;
  showProgress: boolean = false;


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

  onVideoSelected(event: any): void {

    const file: File = event.target.files[0];
    if (file) {

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

  onThumbnailSelected(event: any): void {
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

  checkForFormat(file: File): boolean {
    return file.type === 'image/jpeg' || file.type === 'image/png';
  }

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
      this.startUploadAnimation();
    } else {
      this.ps.errorPopup('Please fill all fields with valid data. Are you using the correct video and image formats?');
    }
  }

  startUploadAnimation() {
    this.uploadProgress = 0;
    this.showProgress = true;

    const interval = setInterval(() => {
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      } else {
        this.uploadProgress += 1;
      }
    }, 15);
  }

  isFormValid() {
    return this.movieForm.valid && this.selectedThumbnail && this.selectedVideo;
  }

  resetFields(): void {
    this.movieForm.reset();
    this.inputFinished = true;
  }

  getField(key: string) {
    let myForm = this.movieForm;
    let field = myForm?.get(key);
    return field;
  }

  dirtyTouched(field: any): boolean {
    return field.dirty || field.touched;
  }

  isInvalid(key: string): boolean {
    const field = this.getField(key);
    if (field) {
      return field.invalid && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  isValidInput(key: string): boolean {
    const field = this.getField(key);
    if (field) {
      return !this.isInvalid(key) && field.valid;
    } else {
      return false;
    }
  }

  requiredErrors(key: string): boolean {
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
      return null;
    }
  }
}
