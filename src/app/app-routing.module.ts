import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscaComponent } from './pages/busca/busca.component';
import { HomeComponent } from './pages/home/home.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { BuscarComponent } from './pages/buscar/buscar.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'busca', component: BuscaComponent},
  {path: 'favoritos', component: FavoritosComponent},
  {path: 'buscar', component: BuscarComponent},
  {path:'', redirectTo: 'busca', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
