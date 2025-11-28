/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
import { THEMES } from "./src/lib/constants"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui:{
    themes:THEMES
  }
}