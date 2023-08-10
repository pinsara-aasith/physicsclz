
"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "./resources/icon.png");
const express = require('express');
const app = express();
const PORT = 3010;

app.use(express.static('out/renderer'));

app.get('/test', (req, res) => {
    res.send('HTTP server working!');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "./out/preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });

  mainWindow.loadURL('http://localhost:3010');

}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
