import { Routes } from '@angular/router';
import { Login } from './pages/login/login.component';
import { Register } from './pages/register/register.component';
import { Dashboard } from './pages/dashboard/dashboard.component';
import { Profile } from './pages/profile/profile.component';
import { DashboardRh } from './pages/dashboard-rh/dashboard-rh';
import { DashboardTechnique } from './pages/dashboard-technique/dashboard-technique';
import { DashboardCandidat } from './pages/dashboard-candidat/dashboard-candidat';
import { OffreAdd } from './pages/dashboard-rh/Offre/offre-add/offre-add';
import { OffreList } from './pages/dashboard-rh/Offre/offre-list/offre-list';
import { OffreAjout } from './pages/dashboard-rh/Offre/offre-ajout/offre-ajout';
import { OffreUpdate } from './pages/dashboard-rh/Offre/offre-update/offre-update';
import { OffreArchive } from './pages/dashboard-rh/Offre/offre-archive/offre-archive';
import { DocumentsComponent } from './pages/candidat/documents/documents.component';
import { CandidatureList } from './pages/dashboard-rh/Candidature/candidature-list';
import { PreselectionneeComponent } from './pages/rh/preselectionnees/preselectionnees.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'dashboard/rh', component: DashboardRh },
  { path: 'dashboard/rh/offre', component: OffreAdd },
  { path: 'dashboard/rh/offre/list', component: OffreList },
  { path: 'dashboard/rh/offre/Add', component: OffreAjout },
  { path: 'dashboard/rh/offre/update/:id', component: OffreUpdate },
  { path: 'dashboard/rh/offre/archive', component: OffreArchive },
  { path: 'dashboard/rh/preselectionnees', component: PreselectionneeComponent },
  { path: 'dashboard/rh/candidatures', component: CandidatureList },
  { path: 'dashboard/technique', component: DashboardTechnique },
  { path: 'dashboard/candidat', component: DashboardCandidat },
  { path: 'candidat/documents', component: DocumentsComponent },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: 'login' }
];
