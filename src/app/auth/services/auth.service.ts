import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

// Enviroments
import { environment } from '../../../environments/environment';

// Interface
import { AuthResponse, Usuario } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _baseUrl: string = environment.baseUrl;
  private _user!: Usuario;

  get user() {
    return {...this._user};
  }

  constructor( private http: HttpClient ) { }

  login( email: string, password: string ){
    
    const url = `${this._baseUrl}/auth`;
    const body = { email, password };
    
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( resp => {
          if( resp.ok ){
            
            localStorage.setItem('token', resp.token!);

            this._user = {
              name: resp.name!,
              uid: resp.uid!,
            };
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error) )
      )  
  };

  validarToken(){
    const url = `${this._baseUrl}/auth/renew`;
    const misHeaders = new HttpHeaders().set( 'x-token', localStorage.getItem('token') || '');
    return this.http.get(url, { headers: misHeaders });
  }


}
