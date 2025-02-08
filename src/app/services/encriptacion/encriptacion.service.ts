import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root' // Disponible en toda la app
})
export class EncryptionService {
  private claveSecreta = "Fafs.14051994@"; // 🔒 Usa una clave segura

  constructor() { }

  // 🔹 Cifrar datos (Convierte el objeto a string y lo cifra)
  cifrarDatos(datos: any): string {
    const datosString = JSON.stringify(datos);
    return CryptoJS.AES.encrypt(datosString, this.claveSecreta).toString();
  }

  // 🔹 Descifrar datos (Convierte el string cifrado a objeto)
  descifrarDatos(datosCifrados: string): any {
    try {
        const bytes = CryptoJS.AES.decrypt(datosCifrados, this.claveSecreta);
        const datosDescifrados = bytes.toString(CryptoJS.enc.Utf8);
        
        return datosDescifrados ? JSON.parse(datosDescifrados) : null;
    } catch (error) {
        console.error("❌ Error al descifrar los datos:", error);
        return null;
    }
}
}
