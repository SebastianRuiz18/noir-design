// Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

// Receive currentSubcategoryId as a prop
function Navbar({ catalog, currentSubcategoryId }) { // <--- ADD THIS PROP
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    navigate(`/${categoryId}/${subcategoryId}`);
    setOpen(false);
    setActiveCategory(categoryId); // Keep parent category open when navigating
  };

  const handleHomeClick = () => {
    navigate("/");
    setOpen(false);
    setActiveCategory(null); // Close any open categories on home
  };

  const handleAboutClick = () => {
    navigate("/about");
    setOpen(false);
    setActiveCategory(null); // Close any open categories on about
  };

  const handleContactClick = () => {
    navigate("/contact");
    setOpen(false);
    setActiveCategory(null); // Close any open categories on contact
  };

  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {!open && (
        <button
          className="hamburger-icon"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú de navegación" // Accessibility
          aria-controls="sidenav-menu" // Accessibility
          aria-expanded={open} // Accessibility
        >
          &#9776;
        </button>
      )}

      <div className={`sidenav ${open ? "open" : ""}`} id="sidenav-menu" role="navigation"> {/* Accessibility */}
        <button
          className="closebtn"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú de navegación" // Accessibility
        >
          &times;
        </button>

        <div className="sidenav-content">
          <div className="logo-container">
            <img className="logo" src={logo} alt="noir-design" onClick={handleHomeClick} />
          </div>

          <h2 className="navbar-title">Catálogo</h2>

          {catalog.map((category) => (
            <div key={category.id} className="category">
              <h3
                className={`category-name ${activeCategory === category.id || category.subcategories?.some(sub => sub.id === currentSubcategoryId && sub.categoryId === category.id) ? 'active' : ''}`} // Active Category Highlight
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={activeCategory === category.id} // Accessibility
              >
                {category.name}
              </h3>
              {(activeCategory === category.id || category.subcategories?.some(sub => sub.id === currentSubcategoryId && sub.categoryId === category.id)) && ( // Keep category open if its subcategory is active
                <ul className="subcategory-list">
                  {category.subcategories?.map((sub) => (
                    <li
                      key={sub.id}
                      className={`subcategory-item ${currentSubcategoryId === sub.id ? 'active' : ''}`} // Active Subcategory Highlight
                      onClick={() => handleSubcategoryClick(category.id, sub.id)}
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Enlaces adicionales fijos abajo */}
          <div className="additional-links">
            <ul>
              <li
                onClick={handleAboutClick}
                className={window.location.pathname === '/about' ? 'active-link' : ''} // Basic active highlighting for fixed links
              >
                Sobre Nosotros
              </li>
              <li
                onClick={handleContactClick}
                className={window.location.pathname === '/contact' ? 'active-link' : ''} // Basic active highlighting for fixed links
              >
                Contacto
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;