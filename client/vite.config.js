import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "../.env" });

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.VITE_APP_PORT || 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_APP_SERVER_URL || "http://server:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      src: "/src",
      "@src": "/src",
      "@assets": "/src/assets",
      "@actions": "/src/actions",
      "@middlewares": "/src/middlewares",
      "@config": "/src/config",
      "@reducers": "/src/reducers",
      "@utils": "/src/utils",
      "@user": "/src/view/user",
      "@views": "/src/views",
    },
    define: {
      "process.env": process.env,
    },
  },
});
