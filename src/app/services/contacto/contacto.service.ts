import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private API_URL = 'http://localhost/agenda/contacto.php'; // Reemplaza con tu URL


  constructor(private http: HttpClient) {}

  // Obtener todos los contactos
  getContactos(id:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post(this.API_URL, { accion: 'consultar', codigo:id }, { headers });
  }

  // Agregar un nuevo contacto
  addContacto(contacto: any,idUser:any): Observable<any> {

    console.log(idUser);

    const body = JSON.stringify({ accion: 'insertar', cod_persona:idUser, ... contacto });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post(this.API_URL, body, { headers });
  }

  // Actualizar un contacto existente
  updateContacto(cod_contacto: number, contacto: any): Observable<any> {
const body = JSON.stringify({ accion: 'actualizar', cod_contacto: cod_contacto, ...contacto });
console.log(body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post(this.API_URL, body, { headers });
  }

  // Eliminar un contacto
  deleteContacto(cod_contacto: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post(this.API_URL, { accion: 'eliminar', cod_contacto:cod_contacto }, { headers });
  }
}