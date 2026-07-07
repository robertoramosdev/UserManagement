import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // bind on all interfaces (0.0.0.0) — reachable via 127.0.0.1 too
    port: 5173,
    strictPort: true, // fail loudly instead of silently moving to 5174
  },
});
