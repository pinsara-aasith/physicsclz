"use strict";

const path = require("path");
const express = require('express');

const app = express();
const PORT = 5173;

let log = '';

app.get('/test', (req, res) => {
  res.send('HTTP server working!');
});

app.get('/strapi-logs', (req, res) => {
  res.send(log);
});


app.use('/assets', express.static(path.join(__dirname, './out/renderer/assets')));
app.use('/images', express.static(path.join(__dirname, './out/renderer/images')));
app.use('/locales', express.static(path.join(__dirname, './out/renderer/locales')));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './out/renderer/index.html'));
});


app.listen(PORT, () => console.log(`HTTP server started on port: ${PORT}`));
