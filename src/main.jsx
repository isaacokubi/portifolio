// Load React so the application can use JSX and render its component tree.
import React from 'react';
// Import React's browser mounting function, which connects the app to the HTML document.
import { createRoot } from 'react-dom/client';
// Import the root component that renders the portfolio and its editor.
import App from './App.jsx';
// Load the styles that control layout, colours, responsive behaviour, and accessibility.
import './styles.css';

// Find the mounting element in index.html, then render the React application inside it.
createRoot(document.getElementById('root')).render(
  // StrictMode helps reveal certain unsafe patterns during development.
  <React.StrictMode>
    {/* App contains the public portfolio and the private-in-this-browser editor UI. */}
    <App />
  </React.StrictMode>,
);
