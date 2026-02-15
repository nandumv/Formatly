import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Relative base path for maximum compatibility
    build: {
        outDir: 'docs',
        assetsDir: 'assets',
        sourcemap: false
    }
});
