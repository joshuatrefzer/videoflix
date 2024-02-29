import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { Router, RouterModule } from '@angular/router';
import { PopupService } from '../services/popup.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [SearchbarComponent, RouterModule]
})
export class HeaderComponent {

    constructor(public router:Router, public ps:PopupService){

    }

    openPopup(){
        this.ps.openPopup();
        this.ps.userPopup= true;
    }

}
