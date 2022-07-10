import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class MovementsGuard implements CanActivate, CanActivateChild {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLogged()
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLogged()
  }

  private isLogged() {
    return this.auth.isLogged().pipe(
      map((isLogged) => {
        if (!isLogged) return this.router.parseUrl('/login')
        return true
      })
    )
  }
}
