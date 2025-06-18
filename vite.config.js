import { defineConfig } from 'vite';

export default defineConfig({
  root: 'speakup-modern', // Set speakup-modern as the project root
  build: {
    outDir: '../dist', // Adjust output directory if needed, relative to new root
    rollupOptions: {
        input: {
            main: 'speakup-modern/o-metodo.html', // Adjust if you have other entry HTML files
            // Add other HTML entry points if necessary
            // index: 'speakup-modern/index.html', 
        }
    }
  }
});