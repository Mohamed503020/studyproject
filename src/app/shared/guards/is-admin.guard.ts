// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate, CanActivateChild {

  constructor(private _AuthService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable< boolean>  {
    return this._AuthService.currentUserObserv.pipe(map(x=>{
      let UserRole=x.userType;
      if(UserRole==UserRoleEnum.Admin){
        return true
      }
      return false
    }))
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable< boolean> {

   return this._AuthService.currentUserObserv.pipe(map(x=>{
    let UserRole=x.userType;
    if(UserRole==UserRoleEnum.Admin){
      return true
    }
    return false
  }))
}
}
