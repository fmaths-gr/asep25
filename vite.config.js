import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// === Ρυθμίσεις Vite ===
export default defineConfig({
  plugins: [react()],
  server: {
    host: true // Επιτρέπει πρόσβαση από τοπικό δίκτυο
  }
});
