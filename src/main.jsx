import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Admin from './Admin'
import ProductPage from "./pages/ProductPage";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product/:subcategory/:productId" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)