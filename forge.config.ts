import type { ForgeConfig } from '@electron-forge/shared-types';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerWix } from '@electron-forge/maker-wix';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'SIG Totem Estacionamento',
    executableName: 'sig-totem-estacionamento',
    // icon: './public/icon', // Adicione ícones em public/icon.ico, public/icon.png, etc. quando disponíveis
  },
  rebuildConfig: {},
  makers: [
    // Windows
    new MakerSquirrel({
      name: 'sig-totem-estacionamento',
      // setupIcon: './public/icon.ico', // Adicione quando tiver o ícone
    }),
    new MakerWix({
      name: 'sig-totem-estacionamento',
      description: 'SIG Totem Estacionamento',
      manufacturer: 'Clube Paineiras',
    }),
    new MakerZIP({}, ['darwin', 'linux']),
    
    // macOS
    new MakerDMG({
      name: 'SIG Totem Estacionamento',
      // icon: './public/icon.icns', // Adicione quando tiver o ícone
    }),
    
    // Linux
    new MakerDeb({
      name: 'sig-totem-estacionamento',
      options: {
        maintainer: 'Clube Paineiras',
        homepage: 'https://example.com',
        description: 'SIG Totem Estacionamento',
      },
    }),
    new MakerRpm({
      name: 'sig-totem-estacionamento',
      options: {
        maintainer: 'Clube Paineiras',
        homepage: 'https://example.com',
        description: 'SIG Totem Estacionamento',
      },
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      // Build apenas do main process e preload script
      // Não precisamos de renderer pois carregamos URL externa (Next.js hosteado)
      build: [
        {
          // `entry` é apenas um alias para `build.lib.entry` no arquivo de configuração do Vite.
          entry: 'electron/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'electron/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      // Array vazio pois não precisamos de renderer (carregamos URL externa)
      renderer: [],
    }),
  ],
};

export default config;
