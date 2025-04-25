import { useState } from "react";

function EditModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product.name);
  const [measures, setMeasures] = useState(product.measures);
  const [image, setImage] = useState(product.image);

  const handleSave = () => {
    onSave({
      id: product.id,
      name,
      measures,
      image,
    });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        color: "#333",
        padding: "2rem",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        fontFamily: "sans-serif"
      }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", color: "#111" }}>
          Editar producto
        </h3>

        <label style={{ fontWeight: "bold" }}>Nombre:</label><br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <label style={{ fontWeight: "bold" }}>Medidas:</label><br />
        <input
          value={measures}
          onChange={(e) => setMeasures(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <label style={{ fontWeight: "bold" }}>Imagen (URL):</label><br />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <img
          src={image}
          alt="preview"
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            display: "block",
            margin: "0 auto 1rem"
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              background: "#ccc",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            ❌ Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            💾 Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
