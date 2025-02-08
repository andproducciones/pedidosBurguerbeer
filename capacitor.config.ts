import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'agendaFinal',
  webDir: 'www',
  server: {
    cleartext: true // 🔹 Permite solicitudes HTTP sin SSL
  },
  android: {
    allowMixedContent: true // 🔹 Permite HTTPS ↔ HTTP
  }
};

export default config;
