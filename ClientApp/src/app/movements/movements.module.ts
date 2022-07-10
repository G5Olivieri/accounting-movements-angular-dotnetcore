import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MovementsRoutingModule} from './movements-routing.module';
import {MovementsComponent} from './movements.component';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NewMovementComponent} from './new-movement/new-movement.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {UpdateMovementComponent} from './update-movement/update-movement.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { OnlyThisDialogComponent } from './only-this-dialog/only-this-dialog.component';

@NgModule({
  declarations: [
    MovementsComponent,
    NewMovementComponent,
    UpdateMovementComponent,
    OnlyThisDialogComponent,
  ],
  imports: [
    CommonModule,
    MovementsRoutingModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
  ]
})
export class MovementsModule { }
