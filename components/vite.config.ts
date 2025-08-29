/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Fix for __dirname not being defined in ES modules
          '@': fileURLToPath(new URL('.', import.meta.url)),
        }
      }
    };
});