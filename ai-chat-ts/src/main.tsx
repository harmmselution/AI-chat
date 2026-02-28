import React from "react";
import ReactDOM from "react-dom/client";
 import "./styles/global.scss";
import { App } from "./App";
import { Toaster } from "react-hot-toast";
 
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    />
  </React.StrictMode>
);