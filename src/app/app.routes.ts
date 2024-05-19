import { Routes } from '@angular/router';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { AboutComponent } from './about/about.component';
import { AuthComponent } from './auth/auth.component';
import { UploadComponent } from './upload/upload.component';
import { SuccessComponent } from './success/success.component';
import { SearchComponent } from './search/search.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LegalsComponent } from './legals/legals.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
    { path: 'success', component: SuccessComponent },
    { path: '', component: HomescreenComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'home', component: HomescreenComponent },
    { path: 'about', component: AboutComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'legals', component: LegalsComponent },
    { path: 'search', component: SearchComponent },
    { path: 'resetpassword', component: ResetpasswordComponent },
    { path: 'authentication', component: AuthComponent },
    { path: 'upload', component: UploadComponent },
];
