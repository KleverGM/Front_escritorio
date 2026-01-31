import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  // Cargar variables de entorno y permitir sobreescribir el target de la API
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET || "https://cursos-online-api.desarrollo-software.xyz";

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path, // Mantener /api/ en el proxy
        },
      },
    },
  });
};
