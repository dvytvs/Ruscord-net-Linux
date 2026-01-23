const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron');
const path = require('path');

// Самые жесткие флаги для Wayland и демки
app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer,UseOzonePlatform');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');
app.commandLine.appendSwitch('enable-media-stream');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('allow-http-screen-capture'); // На всякий случай

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'build', 'icons', 'linux', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,    // Разрешаем ноду
      contextIsolation: false, // ВЫКЛЮЧАЕМ ИЗОЛЯЦИЮ (чтобы preload имел доступ к window)
      sandbox: false           // ВЫКЛЮЧАЕМ ПЕСОЧНИЦУ
    }
  });

  win.loadURL('https://ruscord.net');

  // Разрешаем всё без вопросов
  win.webContents.session.setPermissionCheckHandler(() => true);
  win.webContents.session.setPermissionRequestHandler((wc, perm, cb) => cb(true));

  // Хендлер для захвата источников (вызывается из preload)
  ipcMain.handle('get-sources', async () => {
    return await desktopCapturer.getSources({ types: ['window', 'screen'] });
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
