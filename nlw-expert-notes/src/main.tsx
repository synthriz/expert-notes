import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { Toaster } from "sonner";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster
      toastOptions={{
        style: {
          background: "#1e293b", //bg-slate-800
          color: "#a3e635", //text-lime-400
          border: "none",
        }
      }}
    />
  </React.StrictMode>
);
