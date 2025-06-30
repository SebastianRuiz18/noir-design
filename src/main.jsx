import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicCatalog from "./pages/PublicCatalog";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductPage from "./pages/ProductPage";
import Privacidad from "./pages/Privacidad";
import TermsAndConditions from "./pages/TermsAndConditions";

import App from "./App";
import Admin from "./Admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/:categoryId/:subcategoryId" element={<App />} />
        <Route path="/product/:subcategory/:productId" element={<ProductPage />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<TermsAndConditions />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
