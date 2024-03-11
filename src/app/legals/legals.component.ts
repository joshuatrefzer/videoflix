import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-legals',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './legals.component.html',
  styleUrl: './legals.component.scss'
})
export class LegalsComponent {
  email:string = 'jt.fullstack.development@gmail.com';
  showPrivacy: boolean = true;

  constructor(private ps: PopupService){
    this.ps.activeLink = '';
  }



}
