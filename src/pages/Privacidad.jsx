import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import "./Privacidad.css";

function Privacidad() {
  const catalog = useCatalogFromFirebase();

  return (
    <div className="privacy-page-container">
      <Navbar catalog={catalog} />
      <main className="privacy-content">
        <h1>Política de Privacidad</h1>
        <p><strong>Última actualización:</strong> Junio 2025</p>

        <p>
          En Noir Design, nos tomamos muy en serio tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro sitio web.
        </p>

        <h2>1. Información que recopilamos</h2>
        <ul>
          <li>Información que tú nos proporcionas directamente (como tu nombre o correo si llenas un formulario).</li>
          <li>Datos de navegación, como cookies o datos anónimos (usados por herramientas como Google Analytics).</li>
        </ul>

        <h2>2. Cómo usamos tu información</h2>
        <ul>
          <li>Para responder a tus mensajes o solicitudes (por ejemplo, vía WhatsApp).</li>
          <li>Para mejorar nuestro sitio web y servicios.</li>
          <li>Para análisis internos y estadísticas.</li>
        </ul>

        <h2>3. Compartir información</h2>
        <p>
          No compartimos tu información personal con terceros, excepto cuando es necesario para ofrecerte nuestros servicios (por ejemplo, plataformas de análisis o mensajería como WhatsApp).
        </p>

        <h2>4. Tus derechos</h2>
        <p>
          Puedes solicitar en cualquier momento acceso, modificación o eliminación de tus datos escribiéndonos a <strong>noirdesignmx@gmail.com</strong>.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Este sitio puede usar cookies para mejorar tu experiencia de navegación. Puedes desactivarlas desde la configuración de tu navegador.
        </p>

        <h2>6. Cambios a esta política</h2>
        <p>
          Nos reservamos el derecho de modificar esta política en cualquier momento. Te recomendamos revisarla de vez en cuando.
        </p>

        <p>
          Si tienes dudas sobre esta política, contáctanos por WhatsApp o correo electrónico.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default Privacidad;
