// src/pages/TermsAndConditions.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import "./Privacidad.css"; // Usa el mismo estilo que Privacidad

function TermsAndConditions() {
  const catalog = useCatalogFromFirebase();

  return (
    <div className="privacy-page-container">
      <Navbar catalog={catalog} />

      <main className="privacy-content">
        <h1>Términos y Condiciones de Servicio</h1>
        <p>
          En <strong>Noir Design</strong> nos tomamos en serio tu experiencia. Al contratar nuestros servicios,
          aceptas los siguientes términos y condiciones, los cuales están diseñados para proteger ambas partes
          y garantizar un trabajo profesional y transparente.
        </p>

        <h2>Condiciones Generales</h2>
        <ol>
          <li>
            <h2>No se comienza ningun
trabajo sin haberrecibido el
50% de anticipo.</h2>
            <ul>
              <li>Una vez realizado el anticipo o pago completo tu pedido entra en agenda para comenzar con el diseño o impresión.</li>
            </ul>
          </li>
          <li>
            <h2>Si tu pedido es urgente,
tendrá un costo mayor a un
pedido hecho en tiempo.</h2>
            <ul>
              <li>En caso de que no podamos tomar un pedido urgente te lo haremos saber, los pedidos regulares toman mínimo 5 días hábiles.</li>
            </ul>
          </li>
          <li>
            <h2>Una vez autorizado el
diseño, no nos hacemos
responsables de errores de
redacción ni de ortografía.</h2>
            <ul>
              <li>Enviamos un preview antes de cualquier impresión, en caso de que exista un error ya impreso, se tiene que volver a pagar el trabajo completo.</li>
            </ul>
          </li>
          <li>
            <h2>Si el feedback de un diseño
se atrasa, todo el proceso
también se atrasa
considerablemente.</h2>
            <ul>
              <li>El principal motivo de atraso es no tener información o comentarios a tiempo (una vez pasada una semana sin respuesta el pedido se considera como cancelado y no se regresa el anticipo, se tiene que volver a pagar para volver a agendarte).</li>
            </ul>
          </li>
          <li>
            <h2>Los tiempos de entrega
pueden cambiar.</h2>
            <ul>
              <li>El tiempo de entrega se calcula a partir de la aprobación final del diseño y recepción del anticipo. Retrasos en la aprobación por parte del cliente pueden extender la fecha de entrega.</li>
            </ul>
          </li>
          <li>
            <h2>Los colores de impresión
pueden variar.</h2>
            <ul>
              <li>Los colores pueden variar ligeramente entre lo que se ve en pantalla y el producto final impreso, debido a diferencias en configuraciones de monitores e impresoras. Estas variaciones no se consideran defectos.</li>
            </ul>
          </li>
          <li>
            <h2>La propiedad del diseño
pertenece a NOIR DESIGN.</h2>
            <ul>
              <li>El diseño personalizado es propiedad de Noir Design. El cliente puede usarlo exclusivamente para su evento, pero no está autorizado a reproducir, modificar o reutilizar el diseño sin autorización escrita. El diseño puede utilizarse para diferentes clientes también.</li>
            </ul>
          </li>
          <li>
            <h2>Si el proyecto se cancela por
causas ajenas a nosotros no
hacemos devolución del
anticipo.</h2>
            <ul>
              <li>En caso de haber cambios (disminución de cantidades o cancelación de algunos productos no se devuelve anticipo).</li>
            </ul>
          </li>
          <li>
            <h2>Para llevar un registro
ordenado y brindarte mejor
atención, pedimos que las
modificaciones sean
mencionadas por escrito.</h2>
            <ul>
              <li>No por nota de voz, ni llamada para evitar confusiones.</li>
            </ul>
          </li>
          <li>
            <h2>Envíos fuera de Tijuana y
San Diego.</h2>
            <ul>
              <li>Los costos de envío corren por cuenta del cliente. Noir Design no se responsabiliza por retrasos o daños ocasionados por la paquetería. Se proporciona guía de rastreo. (Tomar en cuenta que si es pedido fuera de Tijuana o San Diego toma más días el proceso total).</li>
            </ul>
          </li>
          <li>
            <h2>La conservación de los
diseños.</h2>
            <ul>
              <li>Los archivos de diseño se almacenan por 30 días. Después de ese tiempo, pueden ser eliminados.</li>
            </ul>
          </li>
          <li>
            <h2>Normalmente al terminar
un proyecto, utilizamos
imágenes de éste para
publicidad.</h2>
            <ul>
              <li>En caso de no autorizarlo favor de notificar, en caso de no ser notificado se utilizará en nuestras redes sociales.</li>
            </ul>
          </li>
          <li>
            <h2>Nos reservamos el derecho
de no atender a quien no
respetó nuestro proceso de
trabajo.</h2>
            <ul>
              <li>La salud mental también importa</li>
            </ul>
          </li>
        </ol>

        <p style={{ marginTop: "2rem", fontStyle: "italic", fontSize: "0.9rem", color: "#666" }}>
          Última actualización: 30 de mayo de 2025
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default TermsAndConditions;
