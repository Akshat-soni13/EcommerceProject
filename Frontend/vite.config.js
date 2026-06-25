import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      "/api":{
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      }
  },
}
})


// Why we Use proxy here 
// Beacuse Cors origin issue na aay and frontend baackend sw direct request naa kare
// ham vite ka use kar rahe hai proxy ka to ye frontend ke request ko backend ke request me convert kar dega "/api" jaha dikha dekh woh 3000 wala port par request bhejdega
