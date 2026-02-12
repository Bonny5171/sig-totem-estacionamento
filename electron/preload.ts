import { contextBridge, ipcRenderer } from 'electron';

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Adicione aqui APIs que você queira expor para a aplicação web
  // Exemplo:
  // getVersion: () => process.versions.electron,
  pix: {
    create: (payload: { amount: number; ticketId: string; expiresInSec?: number }) =>
      ipcRenderer.invoke("pix:create", payload),

    status: (orderId: string) =>
      ipcRenderer.invoke("pix:status", orderId),

    onPaid: (cb: (data: any) => void) => {
      ipcRenderer.removeAllListeners("pix:paid");
      ipcRenderer.on("pix:paid", (_evt, data) => cb(data));
    },
    onFailed: (cb: (data: any) => void) => {
      ipcRenderer.removeAllListeners("pix:failed");
      ipcRenderer.on("pix:failed", (_evt, data) => cb(data));
    },
  },
});