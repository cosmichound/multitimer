// @ts-check
 
import type { NextConfig } from "next";
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const devConfig: NextConfig = {

}

const prodConfig: NextConfig = {
  basePath: '/multitimer',
  output: 'export',
 
  images: {
    unoptimized: true,
    loader: 'custom', 
    loaderFile: './imageLoader.js',
  },
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  distDir: 'out',
};



module.exports = (phase:string , { defaultConfig }:NextConfig) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return devConfig;
  }
 
  return prodConfig;
}

