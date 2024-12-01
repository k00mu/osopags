import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react()],
  server: {
    host: "0.0.0.0",
    port: parseInt(Deno.env.get("WEB_PORT") || "5000"),
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: "ws",
      clientPort: 80,
    },
  },
});
