import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
import {addSeconds, isBefore} from 'date-fns'

type LoginResponse = {
  accessToken: string
  expiresIn: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient, @Inject("BASE_URL") private baseURL: string) { }
  public login(username: string, password: string): Observable<LoginResponse> {
    return this
      .httpClient
      .post<LoginResponse>(this.baseURL + "api/login", { username, password })
      .pipe(
        tap(({ accessToken, expiresIn }) => {
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('expiredAt', addSeconds(new Date(), expiresIn).getTime().toString())
        })
      )
  }

  public isLogged() {
    const expiredAt = localStorage.getItem("expiredAt")
    if (expiredAt === null || expiredAt === undefined) {
      return of(false)
    }
    return of(isBefore(new Date(), new Date(parseInt(expiredAt, 10))))
  }
}
