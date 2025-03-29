import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'BurgerBeer',
  webDir: 'www',
  server: {
    cleartext: true ,
    androidScheme: 'http'// 🔹 Permite solicitudes HTTP sin SSL
  },
  android: {
    allowMixedContent: true // 🔹 Permite HTTPS ↔ HTTP
  }
};

export default config;
