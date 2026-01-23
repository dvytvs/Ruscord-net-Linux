const { ipcRenderer } = require('electron');

// Ждем загрузки страницы
window.addEventListener('load', () => {
  // Подменяем метод захвата экрана
  navigator.mediaDevices.getDisplayMedia = async () => {
    console.log('--- ЗАПРОС ДЕМКИ ВЫЗВАН ---');
    
    // Получаем список окон/экранов из мейн-процесса
    const sources = await ipcRenderer.invoke('get-sources');
    
    // Берем самый первый источник (обычно это весь экран)
    const target = sources[0];

    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: target.id,
          minWidth: 1280,
          maxWidth: 1920,
          minHeight: 720,
          maxHeight: 1080
        }
      }
    });
  };
});
