import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})

export class SearchbarComponent {
  isSearchExpanded = false;
  hide:boolean = false;
  count:number = 0;
  searchValue: any;


  toggleSearch() {
    this.isSearchExpanded = true;
    this.count = 0;
    this.startCount();
  }

  startCount() {
    const intervalId = setInterval(() => {
      this.count++;
      if (this.count > 5) {
        this.resetVar();
        clearInterval(intervalId); // Stoppt das Intervall nach dem Aufruf von resetVar()
      }
    }, 1000);
  }

  resetVar() {
    this.hide = true;
    setTimeout(() => {
      this.isSearchExpanded = false;
      this.hide = false;
      this.count = 0; // Setzt den Zähler zurück
    }, 300);
  }
  startSearch() {
    console.log(this.count);
    
    this.count = 0;
    console.log('Starte die Suche mit dem eingegebenen Wert');
  }


}
