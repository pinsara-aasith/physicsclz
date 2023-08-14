
"use strict";
const path = require("path");
const icon = path.join(__dirname, "./resources/icon.png");
const express = require('express');
const { spawn } = require("child_process");
const platform = require("os").platform()

const app = express();
const PORT = 9090;


app.get('/test', (req, res) => {
  res.send('HTTP server working!');
});

// let process = null;

app.use(express.static(path.join(__dirname, './out/renderer')));

if (/^win/.test(platform)) {
  // app.use(express.static(path.join(__dirname,'.\\out\\renderer')));
  // process = spawn('.\\node_modules\\.bin\\strapi', ['start'], { cwd: '.\\physicsclz-backend', shell: true })
} else {
  // app.use(express.static());
  // process = spawn('./node_modules/.bin/strapi', ['start'], { cwd: './physicsclz-backend', shell: true })
}

// process.stdout.on('data', (output) => {
//   if(output.includes('Welcome back!')) {

//   }
//   console.log(`${output}`);
// });

// process.on('error', (error) => {
//   console.error(`Error: ${error.message}`);
// });

// process.on('close', (code) => {
//   console.log(`Strapi process exited with code ${code}`);
// });

app.listen(PORT, () => console.log(`HTTP server started on port: ${PORT}`));
