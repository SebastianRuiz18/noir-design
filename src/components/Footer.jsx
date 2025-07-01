import React from "react";
import "./Footer.css";
import {
  FaInstagram,
  FaPinterest,
  FaFacebookF,
  FaEnvelope,
  FaTiktok,
} from "react-icons/fa";
import logoW from "../assets/logoW.png";
// Import the Link component from React Router
import { Link } from "react-router-dom"; 

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <ul className="footer-links">
          <li>Printing Methods</li>
          <li>Delivery & Dispatch</li>
          <li>FAQs</li>
          <li>Blog</li>
        </ul>

        <div className="footer-logo">
          <img src={logoW} alt="noir-design" />
        </div>

        <ul className="footer-social">
          <li
            onClick={() =>
              window.open(
                "https://www.instagram.com/noirdesignmx/",
                "_blank",
                "noopener noreferrer"
              )
            }
          >
            <FaInstagram /> Instagram
          </li>
          <li
            onClick={() =>
              window.open(
                "https://www.tiktok.com/@noirdesignmx",
                "_blank",
                "noopener noreferrer"
              )
            }
          >
            <FaTiktok /> Tiktok
          </li>
          <li
            onClick={() =>
              window.open(
                "https://pinterest.com/noirdesignmx/",
                "_blank",
                "noopener noreferrer"
              )
            }
          >
            <FaPinterest /> Pinterest
          </li>
          <li
            onClick={() =>
              window.open(
                "mailto:noirdesignmx@gmail.com",
                "_blank",
                "noopener noreferrer"
              )
            }
          >
            <FaEnvelope /> Email
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Noir Design</p>
        <p className="divider">|</p>
        {/* THE FIX IS HERE: Using the <Link> component for proper navigation */}
        <p className="footer-link">
            <Link to="/terminos">Términos</Link>
        </p>
        <p className="divider">|</p>
        <p className="footer-link">
          <Link to="/privacidad">Privacidad</Link>
        </p>
        <p className="divider">|</p>
        <p>
          <a
            href="https://www.linkedin.com/in/sebastian-ruiz-cisneros/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creditos del Sitio
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;