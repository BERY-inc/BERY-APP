import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beryMarket.user',
  appName: 'Bery Market',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
