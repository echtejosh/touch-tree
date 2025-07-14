import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);

/**
 * Main render.
 */
root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);
