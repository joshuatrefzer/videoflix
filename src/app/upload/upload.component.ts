import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { Video } from '../services/interface';
import { BackendService } from '../services/backend.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {


  selectedVideo: File | undefined;
  selectedThumbnail: File | undefined;
  movieForm: FormGroup;

  errorVideo:string | undefined;
  errorThumb: string | undefined;

  constructor(private formBuilder: FormBuilder, private bs: BackendService, public ps: PopupService) {
    this.movieForm = this.formBuilder.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      actors: ['', Validators.required],
      description: ['', Validators.required]
    });
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

      this.bs.uploadVideo(formData);

    }
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
