import { Component, OnInit } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { PopupService } from '../services/popup.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { BackendService } from '../services/backend.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [SearchbarComponent, RouterModule, CommonModule]
})
export class HeaderComponent {
    activeLink: string = '';

    constructor(public router: Router, public ps: PopupService, private authService: AuthService, public backendService: BackendService) {
        backendService.getFavoriteList();
     }


    isActive(path: string): boolean {
        return this.router.url === path;
    }



    openPopup() {
        this.authService.checkForGuestUser();
        this.ps.openPopup();
        this.ps.userPopup = true;
    }

}
