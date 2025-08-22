import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ⚠️ 設定 GitHub Pages 的 base 路徑，與你的 repo 名稱大小寫一致
  base: process.env.NODE_ENV === "production" ? "/log-canvas-creator/" : "/",
  
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(), // 移除 development 專用 componentTagger，避免 build 後空白
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
