const { contextBridge } = require("electron");
const { initWebRTC } = require("./WebRTC.tsx");

window.addEventListener("DOMContentLoaded", () => {
  initWebRTC();
});