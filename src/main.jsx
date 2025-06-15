import React from 'react';
import ReactDOM from 'react-dom/client';

// === Εισαγωγή του κύριου component της εφαρμογής ===
import App from './App';

// === Δημιουργία root και απόδοση της εφαρμογής ===
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
