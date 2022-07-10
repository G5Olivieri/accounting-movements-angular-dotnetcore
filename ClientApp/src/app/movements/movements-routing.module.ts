import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovementsComponent } from './movements.component';
import {NewMovementComponent} from "./new-movement/new-movement.component";
import {UpdateMovementComponent} from "./update-movement/update-movement.component";

const routes: Routes = [
  { path: '', component: MovementsComponent },
  { path: 'new', component: NewMovementComponent },
  { path: ':id', component: UpdateMovementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementsRoutingModule { }
