const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

// --- ОПТИМИЗАЦИЯ ПОД LINUX (Wayland/X11) ---
if (process.platform === "linux") {
  // Главный фикс для GNOME: 'auto' заставляет Electron использовать Wayland нативно,
  // если система его поддерживает. Это убирает лаги демонстрации экрана.
  // При этом на X11 оно автоматически переключится на X11.
  app.commandLine.appendSwitch("ozone-platform-hint", "auto");

  // Включаем поддержку захвата экрана через PipeWire (обязательно для Wayland)
  // и аппаратное ускорение кодирования
  app.commandLine.appendSwitch("enable-features", "WebRTCPipeWireCapturer,WebRTC-H264WithOpenH264FFmpeg");
  
  // В некоторых случаях помогает корректно определять источники
  app.commandLine.appendSwitch("use-fake-ui-for-media-stream");
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "assets", "Images", "icon.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Оставлено как у тебя, но старайся быть осторожнее с внешними сайтами
      webSecurity: true,
      // ВАЖНО: Ссылка должна вести на скомпилированный .js файл, а не на исходник .tsx
      preload: path.join(__dirname, "assets", "code", "TypeScript", "WebRTC-preload.js"),
      enableBlinkFeatures: "WebRTC",
      webviewTag: true
    }
  });

  // Убираем меню
  Menu.setApplicationMenu(null);

  // Загружаем Ruscord.Net
  mainWindow.loadURL("https://ruscord.net/");
  
  // Опционально: открывать ссылки в браузере по умолчанию, а не в приложении
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
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
