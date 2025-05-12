import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const metadata = `
// ==UserScript==
// @name         Migaku Custom Heatmap
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Custom stats for Migaku Memory.
// @author       tmoody
// @license      GPL-3.0
// @match        https://study.migaku.com/*
// @run-at       document-idle
// @grant        GM_addStyle
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