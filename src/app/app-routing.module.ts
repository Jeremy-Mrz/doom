import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignerGuard } from './utils/guards/signer';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'strategy',
    canActivate: [SignerGuard],
    loadComponent: () => import('./strategy/landing/strategy.component').then(m => m.StrategyComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
