import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import Footer from "../components/Footer";
import TiktokWidget from "../components/TiktokWidget";
import FeaturedProducts from "../components/FeaturedProducts";
import "./Home.css";
import logo from "../assets/logo.png";
import logoWfull from "../assets/logoWfull.png";

function Home() {
  const { catalog } = useCatalogFromFirebase();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    // This effect prevents scrolling when the welcome screen or navbar is open
    if (showWelcomeScreen || isNavbarOpen) {
      document.body.classList.add('no-scroll');
    } else {
      // Add a delay to remove the class to allow for CSS transitions
      const transitionEndDelay = setTimeout(() => {
        document.body.classList.remove('no-scroll');
      }, 1500);
      return () => clearTimeout(transitionEndDelay);
    }
  }, [showWelcomeScreen, isNavbarOpen]);

  const openNavbar = () => {
    setIsNavbarOpen(true);
  };

  const handleScrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-collections');
    if (featuredSection) {
      featuredSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="home-page-wrapper">
      {!showWelcomeScreen && <Navbar catalog={catalog} logo={logo} isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />}

      <div
        className={`welcome-screen ${showWelcomeScreen ? 'active' : 'hidden'}`}
        onClick={() => setShowWelcomeScreen(false)}
      >
        <div className="welcome-content">
          <div className="logo-container">
            <img src={logoWfull} alt="Noir Design Logo" className="welcome-logo" />
          </div>
          <div className="welcome-text-container">
            <h1 className="welcome-title">Bienvenidos a Noir Design</h1>
            <p className="welcome-tagline">El Arte de la Impresión Personalizada</p>
            <div className="welcome-description">
              <p>Donde cada diseño cuenta tu historia única</p>
            </div>
          </div>
          <div className="scroll-indicator">
            <span>Toca para entrar</span>
          </div>
        </div>
      </div>

      <main className={`main-home-content ${showWelcomeScreen ? 'hidden-content' : 'visible-content'}`}>
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-text">
            <h2>Creando Recuerdos Inolvidables</h2>
            <p>Diseños exclusivos y papelería fina para cada ocasión especial.</p>
            <button className="cta-button enhanced-button" onClick={handleScrollToFeatured}>
              <span>Descubre Nuestras Colecciones</span>
            </button>
          </div>
        </section>

        <FeaturedProducts />

        <section className="how-it-works-section">
          <h3>¿Cómo Trabajamos?</h3>
          <p className="section-subtitle">Un proceso simple para materializar tus ideas</p>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number"><span>1</span></div>
              <h4>Consulta Personalizada</h4>
              <p>Conversamos sobre tu evento, gustos y necesidades específicas para crear el diseño perfecto.</p>
            </div>
            <div className="step-item">
              <div className="step-number"><span>2</span></div>
              <h4>Diseño Exclusivo</h4>
              <p>Creamos propuestas únicas adaptadas a tu estilo, con revisiones hasta lograr tu satisfacción total.</p>
            </div>
            <div className="step-item">
              <div className="step-number"><span>3</span></div>
              <h4>Producción de Calidad</h4>
              <p>Imprimimos con materiales premium y acabados profesionales que garantizan durabilidad y elegancia.</p>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <h3>Lo Que Dicen Nuestros Clientes</h3>
          <p className="section-subtitle">Experiencias que nos motivan a seguir creando</p>
          <div className="testimonials-grid">
            <div className="testimonial-card enhanced-testimonial">
              <div className="quote-icon">"</div>
              <p>El trabajo de Noir Design superó todas mis expectativas. Las invitaciones de mi boda fueron absolutamente hermosas y todos los invitados las elogiaron.</p>
              <div className="testimonial-author">
                <span>María González</span>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-card enhanced-testimonial">
              <div className="quote-icon">"</div>
              <p>Profesionales excepcionales. Me ayudaron a crear la papelería perfecta para el bautizo de mi hijo. Calidad y atención al detalle impecables.</p>
              <div className="testimonial-author">
                <span>Carlos Rodríguez</span>
                <div className="stars">★★★★★</div>
              </div>
            </div>
            <div className="testimonial-card enhanced-testimonial">
              <div className="quote-icon">"</div>
              <p>Cada evento corporativo que hemos organizado con sus diseños ha sido un éxito. Su creatividad y puntualidad son incomparables.</p>
              <div className="testimonial-author">
                <span>Ana Martínez</span>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-cta-section">
          <h3>¿Listo para Crear Algo Único?</h3>
          <p className="section-subtitle">Contáctanos y comencemos a dar vida a tus ideas</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem'}}>
            <button className="cta-button enhanced-button" onClick={openNavbar}>
              <span>Ver Nuestro Catálogo</span>
            </button>
            <button
              className="secondary-button enhanced-button"
              onClick={() => window.open('https://wa.me/526646489644', '_blank')}
            >
              <span>Contactar por WhatsApp</span>
            </button>
          </div>
        </section>

        <TiktokWidget />
      </main>

      <Footer />
    </div>
  );
}

export default Home;