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

    /**
  * Checks if the current active route matches the provided path.
  *
  * This function takes a string representing the desired path. It then compares this path to the current URL retrieved from the `router.url` property.
  *
  * The function returns `true` if the current URL exactly matches the provided path, indicating the route is active. Otherwise, it returns `false`.
  *
  * @param {string} path - The path to check for active route.
  * @returns {boolean} - True if the route for the provided path is active, false otherwise.
  */
    isActive(path: string): boolean {
        return this.router.url === path;
    }


    /**
     * Triggers function in "ps" - Popupservice Instance.
     * It opens the popup for the User to logout or delete account etc.
     */
    openPopup() {
        this.authService.checkForGuestUser();
        this.ps.openPopup();
        this.ps.userPopup = true;
    }

}
