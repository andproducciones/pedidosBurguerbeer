import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../GLOBAL';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  userData: any;

  private API_URL = GLOBAL.url+'ventas.php'; // Cambia esto a la URL de tu backend
  
    constructor(private http: HttpClient) { }

    
    getCategorias(): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
    
      return this.http.post<any>(
        this.API_URL,
        { accion: 'categorias' },
        { headers }
      );
    }

    getProductos(): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
    
      return this.http.post<any>(
        this.API_URL,
        { accion: 'productos' },
        { headers }
      );
    }

    todosAction(array:any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });

      //console.log(array);
    
      return this.http.post<any>(
        this.API_URL, array,
        { headers }
      );
    }

    marcarServido(correlativo: number): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
    
      const body = {
        accion: 'servido',
        correlativo: correlativo
      };
    
      return this.http.post<any>(this.API_URL, body, { headers });
    }
    
    

}
