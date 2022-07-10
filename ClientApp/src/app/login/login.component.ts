import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = ''
  password = ''
  constructor(
    private auth: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  submit() {
    const { username, password } = this
    this.auth.login(username, password)
      .subscribe(() => {
        this.router.navigate(['/movements'])
      })
  }
}
