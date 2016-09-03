const { app, BrowserWindow } = require('electron');

var Main = {};
g_currentWindow = '';

app.on('ready', () => {
  createWindow('index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (g_currentWindow === null) {
    createWindow('index.html');
  }
});

function createWindow(filename) {
  if (g_currentWindow) {
    throw new Error('A window is already open');
  }

  g_currentWindow = new BrowserWindow({
    frame: true,
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    title: 'Operation Zeus',
    backgroundColor: '#222',
    autoHideMenuBar: true
  });

  g_currentWindow.loadURL(`file://${__dirname}/html/build/${filename}`);
  g_currentWindow.on('closed', () => {
    g_currentWindow = null;
  });
}

Main.closeWindow = function () {
  g_currentWindow.close();
};

Main.hideWindow = function () {
  g_currentWindow.minimize();
};

module.exports = Main;
