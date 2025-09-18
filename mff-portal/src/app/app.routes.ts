// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FloraComponent } from './pages/flora/flora.component';
import { DetalhePlantaComponent } from './pages/detalhe-planta/detalhe-planta.component';
import { HistoriaComponent } from './pages/historia/historia.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { FaunaComponent } from './pages/fauna/fauna.component';
import { DetalheAnimalComponent } from './pages/detalhe-animal/detalhe-animal.component';
import { EventosComponent } from './pages/eventos/eventos.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'flora', component: FloraComponent },
  { path: 'flora/:id', component: DetalhePlantaComponent },
  { path: 'historia', component: HistoriaComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'fauna', component: FaunaComponent },
  { path: 'fauna/:id', component: DetalheAnimalComponent },
  { path: 'eventos', component: EventosComponent }
];
