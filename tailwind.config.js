/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
      ],
  theme: {
    extend: {
      colors:{
        auth:'rgba(13, 19, 33, 1)',
        secondary:'rgba(197, 216, 109, 1)',
        authImage:'rgba(255, 237, 223, 1)'
      },height:{
        height:"90vh"
      }

    },
  },
  plugins: [],
}