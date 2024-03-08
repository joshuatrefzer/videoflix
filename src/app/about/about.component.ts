import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(private ps:PopupService){
    this.ps.activeLink = '/about';
  }
}
