const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Слушатели
  onStatus: (callback) => ipcRenderer.on('splash-status', (event, text) => callback(text)),
  onProgress: (callback) => ipcRenderer.on('splash-progress', (event, downloaded, total, speed) => callback(downloaded, total, speed)),

  // Универсальная отправка (с ограничением каналов)
  send: (channel, ...args) => {
    const allowedChannels = ['cancel-download']; // сюда можно добавлять новые каналы
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },

  // Явные методы
  cancelDownload: () => ipcRenderer.send('cancel-download')
});