"use strict";

const fs = require('fs');
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "./resources/icon.png");
const { spawn, fork } = require("child_process");
const platform = require("os").platform()
const PORT = 5173;


/**
 * `$ strapi start`
 */
// const process1 = fork(path.resolve(__dirname, './strapi.js'), [], { shell: false, stdio: 'inherit' })
const process2 = fork(path.resolve(__dirname, './server.js'), [], { shell: false, stdio: 'inherit' })


function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1300,
    height: 800,
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

  mainWindow.loadURL(`http://localhost:${PORT}`);
}

electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function () {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  electron.app.quit();
  //process1.kill();
  process2.kill();
});
