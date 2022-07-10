import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from "./login/login.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FlexModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HttpAuthInterceptor} from "./http-auth-interceptor.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    FlexModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
