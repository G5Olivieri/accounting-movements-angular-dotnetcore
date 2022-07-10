import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {MovementsGuard} from "./movements.guard";

const routes: Routes = [
  { path: 'movements', loadChildren: () => import('./movements/movements.module').then(m => m.MovementsModule), canActivate: [MovementsGuard], canActivateChild: [MovementsGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
