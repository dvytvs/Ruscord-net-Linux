// renderer.js
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const video = document.getElementById('preview');

let currentStream = null;

startBtn.addEventListener('click', async () => {
  try {
    // Современный и рекомендуемый API
    const constraints = {
      video: {
        cursor: 'always', // показывать курсор
        width: { max: 1920 },
        height: { max: 1080 },
        frameRate: { max: 60 }
      },
      audio: false
    };

    // getDisplayMedia лучше работает с PipeWire/Wayland
    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    currentStream = stream;
    video.srcObject = stream;
    stopBtn.disabled = false;
    startBtn.disabled = true;

    // Логируем треки
    stream.getVideoTracks().forEach(t => {
      console.log('Track label:', t.label, 'readyState', t.readyState);
    });
  } catch (err) {
    console.error('getDisplayMedia error', err);
    alert('Ошибка getDisplayMedia: ' + err.message);
  }
});

stopBtn.addEventListener('click', () => {
  if (!currentStream) return;
  currentStream.getTracks().forEach(t => t.stop());
  video.srcObject = null;
  currentStream = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
