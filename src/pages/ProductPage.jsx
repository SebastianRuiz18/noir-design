import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Tipos de corte visuales (recuerda poner las imágenes en /public/shapes)
const cutShapes = [
  { name: "Rounded", image: "/shapes/rounded.png" },
  { name: "Scalloped", image: "/shapes/scalloped.png" },
  { name: "Square", image: "/shapes/square.png" },
];

function ProductPage() {
  const { subcategory, productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, `products-${subcategory}`, productId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct(snap.data());
      } else {
        alert("Producto no encontrado");
      }
    };

    fetchProduct();
  }, [subcategory, productId]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles ✅");
  };

  if (!product) return <p style={{ padding: "2rem", fontSize: "1.2rem", color: "#333" }}>Cargando producto...</p>;

  return (
    <div style={{
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "sans-serif",
      color: "#222"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#1a73e8",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ⬅ Volver
        </button>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "400px",
              objectFit: "contain",
              border: "1px solid #ccc",
              borderRadius: "8px"
            }}
          />

          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: "0.5rem", fontSize: "2rem" }}>{product.name}</h1>
            <p style={{ marginBottom: "1rem", fontSize: "1.1rem", lineHeight: "1.5" }}>{product.description}</p>
            <p style={{ marginBottom: "1rem", fontStyle: "italic", color: "#555" }}>Medidas: {product.measures}</p>

            <button
              onClick={handleCopyLink}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "0.6rem 1.2rem",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              📋 Copiar enlace del producto
            </button>
          </div>
        </div>

        {/* Tipos de Corte */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Tipos de corte disponibles</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {cutShapes.map((cut) => (
              <div key={cut.name} style={{ textAlign: "center", width: "120px" }}>
                <img
                  src={cut.image}
                  alt={cut.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#fafafa"
                  }}
                />
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#333" }}>{cut.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
