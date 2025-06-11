// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FloraComponent } from './pages/flora/flora.component';
import { DetalhePlantaComponent } from './pages/detalhe-planta/detalhe-planta.component';
import { HistoriaComponent } from './pages/historia/historia.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'flora', component: FloraComponent },
  { path: 'flora/:id', component: DetalhePlantaComponent },
  { path: 'historia', component: HistoriaComponent }
];
