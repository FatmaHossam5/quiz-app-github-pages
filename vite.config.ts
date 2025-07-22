import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/quiz-app-github-pages/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'router-vendor': ['react-router-dom'],
          'form-vendor': ['react-hook-form'],
          'ui-vendor': ['react-window', 'react-select'],
          'utils-vendor': ['axios', 'react-toastify', 'typescript-cookie'],
          
          // App chunks
          'auth-components': [
            './src/Components/Login/Login.tsx',
            './src/Components/Register/Register.tsx',
            './src/Components/ChangePassword/ChangePassword.tsx',
            './src/Components/RequsetResetPass/RequsetResetPass.tsx',
            './src/Components/RestPassword/RestPassword.tsx',
          ],
          'quiz-components': [
            './src/Components/Quizzes/Quizzes.tsx',
            './src/Components/Questions/Questions.tsx',
            './src/Components/Results/Results.tsx',
          ],
          'student-components': [
            './src/Components/StudentComponents/Quiz/Quiz.tsx',
            './src/Components/StudentComponents/Student\'sQuestion/StudentsQuestion.tsx',
            './src/Components/Students/Students.tsx',
            './src/Components/Groups/Groups.tsx',
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging
    sourcemap: true,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'react-router-dom',
      'react-hook-form',
      'axios',
      'react-toastify',
      'typescript-cookie',
      'react-window',
      'react-select'
    ],
  },
  // Development server configuration
  server: {
    // Enable HMR for better development experience
    hmr: true,
    // Open browser on start
    open: true,
    // Port configuration
    port: 3000,
  },
  // Preview server configuration
  preview: {
    port: 3000,
  },
  // Define global constants
  define: {
    // Enable performance monitoring in development
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PERFORMANCE_MONITORING__: JSON.stringify(true),
  },
  // Enable CSS processing
  css: {
    devSourcemap: true,
  }
})
