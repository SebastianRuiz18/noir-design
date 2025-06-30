// src/pages/Contact.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const catalog = useCatalogFromFirebase();
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    designs: "",
    quantity: "",
    foundUs: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isPastDate = (dateStr) => {
    const today = new Date();
    const inputDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
  };

  const handleSubmit = () => {
    const { name, date, location, designs, quantity, foundUs } = form;

    if (!name.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    if (!date) {
      alert("Por favor, selecciona una fecha.");
      return;
    }

    if (isPastDate(date)) {
      alert("La fecha del evento no puede ser en el pasado.");
      return;
    }

    if (!location.trim()) {
      alert("Por favor, indica tu ciudad o ubicación.");
      return;
    }

    if (!designs.trim()) {
      alert("Por favor, describe los diseños que te interesan.");
      return;
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("Por favor, ingresa una cantidad válida.");
      return;
    }

    if (!foundUs) {
      alert("Por favor, dinos cómo nos encontraste.");
      return;
    }

    const message = `Hola, soy ${name}.%0A%0AMi evento es el día ${date}.%0AMe encuentro en ${location}.%0AMe interesan los diseños: ${designs}.%0ANecesito ${quantity} piezas.%0AY te encontré vía ${foundUs}.`;
    window.open(`https://wa.me/526646489644?text=${message}`, "_blank");

    setForm({
      name: "",
      date: "",
      location: "",
      designs: "",
      quantity: "",
      foundUs: "",
    });

    alert("Abriendo WhatsApp con tu mensaje. ¡Gracias por contactarnos!");
  };

  return (
    <div className="contact-page-container">
      <Navbar catalog={catalog} />
      <main className="contact-main-content">
        <div className="contact-form-card">
          <h2 className="contact-title">¡Contáctanos por WhatsApp!</h2>

          <div className="form-group">
            <label htmlFor="name">Tu nombre:</label>
            <input
              className="contact-input"
              type="text"
              id="name"
              name="name"
              placeholder="Ej: María López"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha del evento:</label>
            <input
              className="contact-input"
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Ciudad:</label>
            <input
              className="contact-input"
              type="text"
              id="location"
              name="location"
              placeholder="Ej: Tijuana, San Diego"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="designs">Diseños que te interesan:</label>
            <textarea
              className="contact-textarea"
              id="designs"
              name="designs"
              placeholder="Ej: Menú wavy, place card doblez..."
              value={form.designs}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">¿Cuántas piezas necesitas?</label>
            <input
              className="contact-input"
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Ej: 50"
              min="1"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="foundUs">¿Dónde nos encontraste?</label>
            <select
              className="contact-select"
              id="foundUs"
              name="foundUs"
              value={form.foundUs}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="Recomendación">Recomendación</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button className="contact-submit-button" onClick={handleSubmit}>
            Enviar por WhatsApp
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
