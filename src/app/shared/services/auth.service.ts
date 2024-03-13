import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthUserDto } from '../dtos/auth-user.dto';
import { LoginModel } from '../models/login-model';
export interface token{
  access_token:string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {



  private currentUserSubject: BehaviorSubject<AuthUserDto> = new BehaviorSubject<AuthUserDto>({} as AuthUserDto);

  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    var currentUserStorage = localStorage.getItem('currentUser');
    if (currentUserStorage != null) {
      this.currentUserSubject.next(JSON.parse(currentUserStorage) as AuthUserDto);
    }
  }

  public get currentUserValue(): AuthUserDto {
    return this.currentUserSubject.value;
  }

  public get currentUserObserv(): Observable<AuthUserDto> {
    return this.currentUserSubject.asObservable();
  }

  login(model: LoginModel) {
    return this._HttpClient.post(environment.apiUrl + 'auth/login', model)
      .pipe(map((response:any) => {
        const decodedToken = this.decodeToken(response.access_token);
        if (decodedToken) {
          const user: AuthUserDto = {
            sub: decodedToken.sub,
            phoneNumber: decodedToken.phoneNumber,
            fullName: decodedToken.fullName,
            validUntil: decodedToken.validUntil,
            userType: decodedToken.userType,
            iat: decodedToken.iat,
            exp: decodedToken.exp
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }

  clearStorage() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({} as AuthUserDto );
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
