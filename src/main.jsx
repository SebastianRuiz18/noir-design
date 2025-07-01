import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App.jsx';
import './index.css';
import './App.css'; // Make sure global styles are imported
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './Admin.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Privacidad from './pages/Privacidad.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
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
    </Router>
  </React.StrictMode>,
);