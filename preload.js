// preload.js
const { contextBridge, desktopCapturer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // получение списока источников — полезно как fallback или для UI
  listDesktopSources: async (opts = { types: ['screen', 'window'] }) => {
    try {
      const sources = await desktopCapturer.getSources(opts);
      // Вернём минимальную информацию клиенту
      return sources.map(s => ({
        id: s.id,
        name: s.name,
        display_id: s.display_id,
      }));
    } catch (err) {
      console.error('listDesktopSources error', err);
      return [];
    }
  }
});
