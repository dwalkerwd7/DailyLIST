import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'

const isModernBrowser = window.CSS?.supports('color', 'var(--test)') && typeof Promise.allSettled === 'function';
if(!isModernBrowser) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Unsupported Browser</h1>
        <p style="font-size: 1.2rem;">It looks like you're using an older browser that may not support all the features required to run this app. Please consider updating to a modern browser for the best experience.</p>
        <div style="margin-top: 2rem;">
          <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" style="margin-right: 1rem; font-size: 1.2rem;">Download Chrome</a>
          <a href="https://www.mozilla.org/firefox/new/" target="_blank" rel="noopener noreferrer" style="margin-right: 1rem; font-size: 1.2rem;">Download Firefox</a>
          <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer" style="font-size: 1.2rem;">Download Edge</a>
        </div>
      </div>
    `;
  }
} else {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)};
