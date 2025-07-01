import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ catalog, currentSubcategoryId }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    // THE FIX: The URL is now correct, e.g., "/before-the-day/invitations"
    navigate(`/${categoryId}/${subcategoryId}`);
    setOpen(false);
    setActiveCategory(categoryId);
  };

  const handleHomeClick = () => {
    navigate("/");
    setOpen(false);
    setActiveCategory(null);
  };

  const handleAboutClick = () => {
    navigate("/about");
    setOpen(false);
    setActiveCategory(null);
  };

  const handleContactClick = () => {
    navigate("/contact");
    setOpen(false);
    setActiveCategory(null);
  };

  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {!open && (
        <button
          className="hamburger-icon"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          &#9776;
        </button>
      )}

      <div className={`sidenav ${open ? "open" : ""}`} role="navigation">
        <button
          className="closebtn"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú de navegación"
        >
          &times;
        </button>

        <div className="sidenav-content">
          <div className="logo-container">
            <img className="logo" src={logo} alt="noir-design" onClick={handleHomeClick} />
          </div>

          <h2 className="navbar-title">Catálogo</h2>

          {(catalog || []).map((category) => (
            <div key={category.id} className="category">
              <h3
                className={`category-name ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </h3>
              {activeCategory === category.id && (
                <ul className="subcategory-list">
                  {(category.subcategories || []).map((sub) => (
                    <li
                      key={sub.id}
                      className={`subcategory-item ${currentSubcategoryId === sub.id ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick(category.id, sub.id)}
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="additional-links">
            <ul>
              <li onClick={handleAboutClick}>Sobre Nosotros</li>
              <li onClick={handleContactClick}>Contacto</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;