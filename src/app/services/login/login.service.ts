import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly API_URL = GLOBAL.url+'login.php'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión con Headers personalizados
  login(usuario: string, clave: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    return this.http.post<any>(this.API_URL, { accion: 'login', usuario: usuario, clave: clave }, { headers });
  
  }

}
