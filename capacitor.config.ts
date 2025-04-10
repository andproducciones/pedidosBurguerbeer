import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.burgerbeer',
  appName: 'BurgerBeer',
  webDir: 'www',
  server: {
    cleartext: true ,
    androidScheme: 'http'// 🔹 Permite solicitudes HTTP sin SSL
  },
  android: {
    allowMixedContent: true // 🔹 Permite HTTPS ↔ HTTP
  },
  plugins: {
    Keyboard: {
      resize: "body" // <-- esto es clave
    }
  }
};

export default config;
