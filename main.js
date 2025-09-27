const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

// Включаем поддержку WebRTC и PipeWire (для демки)
app.commandLine.appendSwitch("enable-features", "WebRTCPipeWireCapturer");
app.commandLine.appendSwitch("enable-features", "WebRTC-H264WithOpenH264FFmpeg");
app.commandLine.appendSwitch("use-fake-ui-for-media-stream", ""); // Временно убирать системное окно выбора

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "assets", "Images", "icon.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      preload: path.join(__dirname, "assets", "code", "TypeScript", "WebRTC-preload.tsx"),
      enableBlinkFeatures: "WebRTC",
      webviewTag: true
    }
  });

  // Убираем меню
  Menu.setApplicationMenu(null);

  // Загружаем Ruscord.Net
  mainWindow.loadURL("https://ruscord.net/");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
