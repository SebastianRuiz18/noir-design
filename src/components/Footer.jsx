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
import { useNavigate } from "react-router-dom"; // 👈 Importar useNavigate

function Footer() {
  const navigate = useNavigate(); // 👈 Hook de navegación

  return (
    <footer className="footer-container">
      <div className="footer-top">
        {/* Sección izquierda */}
        <ul className="footer-links">
          <li>Printing Methods</li>
          <li>Delivery & Dispatch</li>
          <li>FAQs</li>
          <li>Blog</li>
        </ul>

        {/* Logo centrado */}
        <div className="footer-logo">
          <img src={logoW} alt="noir-design" />
        </div>

        {/* Sección derecha */}
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

      {/* Línea inferior */}
      <div className="footer-bottom">
        <p>© 2025 Noir Design</p>
        <p className="divider">|</p>
        <p onClick={() => window.location.href = '/terminos'}>Términos</p>
        <p className="divider">|</p>
        <p onClick={() => navigate("/privacidad")} className="footer-link">
          Privacidad
        </p>
        <p className="divider">|</p>
        <p
          onClick={() =>
            window.open(
              "https://www.linkedin.com/in/sebastian-ruiz-cisneros/",
              "_blank",
              "noopener noreferrer"
            )
          }
        >
          Creditos del Sitio
        </p>
      </div>
    </footer>
  );
}

export default Footer;
