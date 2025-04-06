import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import { v4 as uuidV4 } from "uuid";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={/documents/${uuidV4()}} />} />
      <Route path="/documents/:id" element={<App />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);