import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TrackComponent } from './components/track/track.component';
import { AiQualityComponent } from './components/ai-quality/ai-quality.component';

export const routes: Routes = [
    { path: '', redirectTo: 'track', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent }, // Guard needed in real app
    { path: 'track', component: TrackComponent },
    { path: 'track/:id', component: TrackComponent },
    { path: 'quality-check', component: AiQualityComponent }
];
