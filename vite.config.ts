import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// TEMPORAL: Usar Azure directamente hasta que se desplieguen los nuevos endpoints
const apiTarget = "https://cursos-online-api.desarrollo-software.xyz";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // No reescribir, Azure espera /api/
      },
    },
  },
});
