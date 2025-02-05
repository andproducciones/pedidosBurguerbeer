import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private API_URL = 'http://localhost/agenda/persona.php'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient) { }

  registrar(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    console.log(datos);

    return this.http.post(this.API_URL, { accion: 'insertar', ...datos }, { headers });
  }
  recuperarPassword(correo: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(this.API_URL, { accion: 'recover_pass', correo }, { headers });
  }

  misDatos(codigo: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(this.API_URL, { accion: 'dato', codigo }, { headers });
  }

}
