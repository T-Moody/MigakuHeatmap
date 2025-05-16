import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const githubUsername = 'T-Moody';
const githubRepo = 'MigakuHeatmap';

const metadata = `
// ==UserScript==
// @name         Migaku Custom Heatmap
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Custom stats for Migaku Memory.
// @author       tmoody
// @license      GPL-3.0
// @match        https://study.migaku.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/${githubUsername}/${githubRepo}/release/bundle.js
// @downloadURL  https://raw.githubusercontent.com/${githubUsername}/${githubRepo}/release/bundle.js
// ==/UserScript==
`;

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'MigakuCustomHeatmap',
    sourcemap: true,
    banner: metadata,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ],
};