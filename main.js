// main.js
const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function setupCommandLineFlags() {
  app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer');
  app.commandLine.appendSwitch('ozone-platform', 'wayland');
  app.commandLine.appendSwitch('disable-gpu-sandbox');
  app.commandLine.appendSwitch('enable-experimental-web-platform-features');
  app.commandLine.appendSwitch('use-fake-ui-for-media-stream', 'false');
}

function createWindow() {
  // **Отключаем меню полностью**
  Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    icon: path.join(__dirname, 'build', 'icons', 'linux', '512x512.png'),
    frame: true,                     // системная рамка остаётся
    autoHideMenuBar: true,           // меню НЕ отображается нигде
    titleBarStyle: "default",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
      webSecurity: true,
      enableRemoteModule: false
    }
  });

  win.once('ready-to-show', () => win.show());

  win.loadURL('https://ruscord.net/');

  if (isDev) win.webContents.openDevTools({ mode: 'right' });

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'desktop') callback(true);
    else callback(false);
  });

  win.webContents.on('render-process-gone', (e, details) => {
    console.error('Render process gone:', details);
  });

  return win;
}

app.on('ready', () => {
  setupCommandLineFlags();
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

