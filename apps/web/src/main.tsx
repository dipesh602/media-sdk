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

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <MediaProvider client={client}>
      <App />
    </MediaProvider>
  </React.StrictMode>
);