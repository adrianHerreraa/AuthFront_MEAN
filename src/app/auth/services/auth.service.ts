import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

// Enviroments
import { environment } from '../../../environments/environment';

// Interface
import { AuthResponse, Usuario } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl: string = environment.baseUrl;
  private _user!: Usuario;

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient) {}

  registro(name: string, email: string, password: string) {
    const url = `${this._baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          /*this._user = {
            name: resp.name!,
            uid: resp.uid!,
          };*/
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err))
    );
  }

  login(email: string, password: string) {
    const url = `${this._baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);

          /*this._user = {
            name: resp.name!,
            uid: resp.uid!,
          };*/
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error))
    );
  }

  validarToken(): Observable<boolean> {
    const url = `${this._baseUrl}/auth/renew`;
    const misHeaders = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers: misHeaders }).pipe(
      map((resp) => {
        console.log(resp);

        localStorage.setItem('token', resp.token!);

        this._user = {
          name: resp.name!,
          uid: resp.uid!,
          email: resp.email!,
        };

        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  logout() {
    // Borra unicamente el key especificado.
    // localStorage.removeItem('token');

    // Borra todas las keys guardadas.
    localStorage.clear();
  }
}
