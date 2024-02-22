import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoGenre, genres } from '../services/interface';
import { BackendService } from '../services/backend.service';
import { PopupService } from '../services/popup.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

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

  errorVideo:string | undefined;
  errorThumb: string | undefined;
  errorSubmit:string | undefined;
  genres:VideoGenre[];

  inputFinished:boolean = false;


  constructor(private formBuilder: FormBuilder, public bs: BackendService, public ps: PopupService) {
    this.movieForm = this.formBuilder.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      actors: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.genres = genres;
  }

  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileType = file.type;

      if (fileType === 'video/mp4') {
        this.selectedVideo = file;
        this.errorVideo = undefined;
      } else {
        this.errorVideo = "please select a valid video format (mp4, mov)";
        this.selectedVideo = undefined;
        event.target.value = null;
      }
    }
  }

  onThumbnailSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (this.checkForFormat(file)) {
        this.selectedThumbnail = file;
        this.errorThumb = undefined;
      } else {
        this.errorThumb = "please select a valid image file (jpeg, png)";
        this.selectedThumbnail = undefined;
      }
    }
  }

  checkForFormat(file: File) {
    return file.type === 'image/jpeg' || file.type === 'image/png';
  }


  onSubmit() {
    if (this.selectedThumbnail && this.selectedVideo) {
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
      this.errorSubmit = "please fill all the fields with valid data"
    }
  }

  resetFields(){
    this.movieForm.reset();
    this.inputFinished = true;
  }

  isFormValid(){
    return this.movieForm.valid && this.selectedThumbnail && this.selectedVideo;
  }

  checkForValidation(key: string) {
    return this.movieForm.get(key)?.invalid &&
      (this.movieForm.get(key)?.dirty ||
        this.movieForm.get(key)?.touched);
  }

  isDirty(key:string){
    return this.movieForm.get(key)?.dirty;
  }

}
