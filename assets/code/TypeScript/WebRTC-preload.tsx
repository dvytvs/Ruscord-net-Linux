const { initWebRTC } = require("./WebRTC.tsx");

window.addEventListener("DOMContentLoaded", () => {
  initWebRTC(); // Импортирует initWebRTC и вызывает её после загрузки DOMContentLoaded, то есть инициализирует WebRTC
});