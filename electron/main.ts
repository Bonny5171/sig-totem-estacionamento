import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { registerPixIpc } from './pix';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// URL da aplicação hosteada - altere aqui para sua URL de produção
const HOSTED_URL = process.env.ELECTRON_HOSTED_URL || 'https://sua-url-hosted.com';

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    // Opcional: remover barra de menu
    autoHideMenuBar: true,
    // Opcional: tela cheia para totem
    // fullscreen: true,
  });

  // Carrega a aplicação Next.js
  // Em desenvolvimento, usa o servidor Next.js local
  // Em produção, carrega a URL hosteada
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // Abre DevTools em desenvolvimento
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carrega a URL hosteada
    mainWindow.loadURL(HOSTED_URL);
    
    // Se preferir usar build local estático, descomente a linha abaixo
    // e configure o Next.js para export estático (output: 'export' no next.config.ts)
    // mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  // Opcional: abrir DevTools em produção (útil para debug)
  // mainWindow.webContents.openDevTools();

  function getMainWindow() {
    return mainWindow;
  }

  registerPixIpc(getMainWindow);
};

// This method will be called when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
