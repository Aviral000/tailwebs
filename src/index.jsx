import React from 'react';
import App from "./App";
import ReactDom from 'react-dom/client';

const Container = document.getElementById('root');
const root = ReactDom.createRoot(Container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)