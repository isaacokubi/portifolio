// Import Vite's helper for defining a typed, editor-friendly configuration object.
import { defineConfig } from 'vite';
// Enable Vite's React transform and development support for JSX.
import react from '@vitejs/plugin-react';
// Enable Tailwind CSS v4 processing inside Vite's build pipeline.
import tailwindcss from '@tailwindcss/vite';

// Export the settings Vite uses for both local development and production builds.
export default defineConfig({
  // Register the React and Tailwind plugins so their syntax is processed correctly.
  plugins: [react(), tailwindcss()],
});
