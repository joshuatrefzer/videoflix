import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss'
})
export class BottomBarComponent {
  constructor(public ps:PopupService){

  }
}
