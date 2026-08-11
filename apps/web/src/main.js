import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MediaProvider } from "@media-sdk/react";
import { createMediaClient } from "@media-sdk/core";
import "./styles.css";
const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
const client = createMediaClient({
    apiKey
});
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(MediaProvider, { client: client, children: _jsx(App, {}) }) }));
