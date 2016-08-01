const { app, BrowserWindow } = require('electron');

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
    title: 'Operation Zeus'
  });

  g_currentWindow.loadURL(`file://${__dirname}/html/build/${filename}`);
  g_currentWindow.on('closed', () => {
    g_currentWindow = null;
  });
}
