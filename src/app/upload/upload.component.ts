import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { Video } from '../services/interface';
import { BackendService } from '../services/backend.service';

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

  constructor(private formBuilder: FormBuilder, private bs: BackendService) {
    this.movieForm = this.formBuilder.group({
      title: [''],
      genre: [''],
      actors: [''],
      description: ['']
    });
  }

  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileType = file.type;

      if (fileType === 'video/mp4') {
        this.selectedVideo = file;
      } else {
        ///TODO: Error In UI anzeigen! 
        console.error('Bitte wählen Sie eine Video-Datei aus.');
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
      } else {
        ///TODO: Error In UI anzeigen! 
        console.error('Wählen Sie bitte eine Bild-Datei aus')
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

      
      console.log(formData);
      this.bs.uploadVideo(formData);

    }
  }

}
