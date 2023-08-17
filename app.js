
"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "./resources/icon.png");
const express = require('express');
const { spawn } = require("child_process");
const platform = require("os").platform()

const app = express();
const PORT = 5173;


app.get('/test', (req, res) => {
  res.send('HTTP server working!');
});

let process = null;

app.use('/assets', express.static(path.join(__dirname, './out/renderer/assets')));
app.use('/images', express.static(path.join(__dirname, './out/renderer/images')));
app.use('/locales', express.static(path.join(__dirname, './out/renderer/locales')));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './out/renderer/index.html'));
});

if (/^win/.test(platform)) {
  process = spawn('.\\node_modules\\.bin\\strapi', ['start'], { cwd: '.\\physicsclz-backend', shell: true })
} else {
  process = spawn('./node_modules/.bin/strapi', ['start'], { cwd: './physicsclz-backend', shell: true })
}

process.stdout.on('data', (output) => {
  if(output.includes('Welcome back!')) {

  }
  console.log(`${output}`);
});

process.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

process.on('close', (code) => {
  console.log(`Strapi process exited with code ${code}`);
});

app.listen(PORT, () => console.log(`HTTP server started on port: ${PORT}`));

function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1100,
    height: 790,
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
  process.kill();
});