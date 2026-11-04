import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { asset } from './utils';

// Warm the cache with every image while the visitor is on the intro, so later sections don't pop in.
['couple', 'curtains', 'floral', 'sparkle', 'hands'].forEach((n) => { new Image().src = asset(`${n}.jpg`); });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
