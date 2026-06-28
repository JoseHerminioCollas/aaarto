import { Buffer } from "buffer";
window.Buffer = Buffer;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@components/App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
