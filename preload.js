const { ipcRenderer } = require('electron');

window.addEventListener('load', () => {
  navigator.mediaDevices.getDisplayMedia = async () => {
    const sources = await ipcRenderer.invoke('get-sources');
    
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
