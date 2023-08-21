"use strict";

const fs = require('fs');
require('dotenv').config();

const tsUtils = require('./physicsclz-backend/node_modules/@strapi/typescript-utils');
const strapi = require('./physicsclz-backend/node_modules/@strapi/strapi/lib');

const path = require("path");

async function startStrapiServer() {
  const backendPath = path.join(__dirname, './physicsclz-backend');
  const appDir = backendPath;
  const isTSProject = await tsUtils.isUsingTypeScript(appDir);
  const outDir = await tsUtils.resolveOutDir(appDir);
  const distDir = isTSProject ? outDir : appDir;

  const buildDirExists = fs.existsSync(outDir);
  if (isTSProject && !buildDirExists)
    throw new Error(
      `${outDir} directory not found. Please run the build command before starting your application`
    );

  return strapi({ 
    appDir: process.env.NODE_ENV == 'production' ? './resources/app/physicsclz-backend' : './physicsclz-backend', 
    distDir:  process.env.NODE_ENV == 'production' ? './resources/app/physicsclz-backend/dist' : './physicsclz-backend/dist',
  }).start();
};

startStrapiServer();