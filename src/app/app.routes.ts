import { Routes } from '@angular/router';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { UploadComponent } from './upload/upload.component';
import { SuccessComponent } from './success/success.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    { path: 'success', component: SuccessComponent },
    { path: 'home', component: HomescreenComponent },
    { path: 'about', component: AboutComponent },
    { path: 'search', component: SearchComponent },
    { path: 'authentication', component: AuthComponent },
    { path: 'upload', component: UploadComponent },
];
