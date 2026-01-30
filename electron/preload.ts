import { contextBridge } from 'electron';

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Adicione aqui APIs que você queira expor para a aplicação web
  // Exemplo:
  // getVersion: () => process.versions.electron,
});
