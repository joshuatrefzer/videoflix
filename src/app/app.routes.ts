import { Routes } from '@angular/router';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { UploadComponent } from './upload/upload.component';

export const routes: Routes = [
    { path: 'home', component: HomescreenComponent },
    { path: 'about', component: AboutComponent },
    { path: 'authentication', component: AuthComponent },
    { path: 'upload', component: UploadComponent },
];
