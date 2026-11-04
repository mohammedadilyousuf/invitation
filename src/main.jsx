import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { asset, coupleImage, handsImage } from './utils';

// Warm the cache with every image while the visitor is on the intro, so later sections don't pop in.
[coupleImage(), handsImage(), ...['curtains', 'floral', 'sparkle'].map((n) => asset(`${n}.jpg`))].forEach((src) => { new Image().src = src; });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
