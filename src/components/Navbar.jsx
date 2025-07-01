import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ catalog, currentSubcategoryId }) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const closeSidebar = () => setOpen(false);

  return (
    <>
      {open && <div className="overlay" onClick={closeSidebar}></div>}

      {!open && (
        <button className="hamburger-icon" onClick={() => setOpen(true)} aria-label="Abrir menú">
          &#9776;
        </button>
      )}

      <div className={`sidenav ${open ? "open" : ""}`} role="navigation">
        <button className="closebtn" onClick={closeSidebar} aria-label="Cerrar menú">
          &times;
        </button>

        <div className="sidenav-content">
          <div className="logo-container">
            <Link to="/" onClick={closeSidebar}>
              <img className="logo" src={logo} alt="noir-design" />
            </Link>
          </div>

          <h2 className="navbar-title">Catálogo</h2>

          {Array.isArray(catalog) && catalog.map((category) => (
            <div key={category.id} className="category">
              <h3 className={`category-name ${activeCategory === category.id ? 'active' : ''}`} onClick={() => handleCategoryClick(category.id)}>
                {category.name}
              </h3>
              {activeCategory === category.id && (
                <ul className="subcategory-list">
                  {(category.subcategories || []).map((sub) => (
                    <li key={sub.id} className={`subcategory-item ${currentSubcategoryId === sub.id ? 'active' : ''}`}>
                      <Link to={`/${category.id}/${sub.id}`} onClick={closeSidebar}>
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="additional-links">
            <ul>
              {/* Using Link for all internal navigation */}
              <li><Link to="/about" onClick={closeSidebar}>Sobre Nosotros</Link></li>
              <li><Link to="/contact" onClick={closeSidebar}>Contacto</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;