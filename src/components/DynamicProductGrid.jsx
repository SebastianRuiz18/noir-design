import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import EditModal from "./EditModal";

function DynamicProductGrid({ subcategoryId, isAdmin }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMeasures, setEditMeasures] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!subcategoryId) return;

    const q = query(collection(db, `products-${subcategoryId}`), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
    });

    return () => unsubscribe();
  }, [subcategoryId]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, `products-${subcategoryId}`, id));
        alert("Producto eliminado ✅");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el producto ❌");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditMeasures(product.measures);
    setEditImage(product.image);
    setEditDescription(product.description);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;

    const ref = doc(db, `products-${subcategoryId}`, editingProduct.id);
    try {
      await updateDoc(ref, {
        name: editName,
        measures: editMeasures,
        image: editImage,
        description: editDescription,
      });
      alert("Producto actualizado ✅");
      setEditingProduct(null);
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al actualizar el producto ❌");
    }
  };

  if (!subcategoryId) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      padding: "1rem"
    }}>
      {products.length === 0 ? (
        <p>No hay productos aún en esta subcategoría.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} style={{ height: "100%" }}>
            {editingProduct?.id === product.id ? (
              <div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nombre"
                /><br />
                <input
                  value={editMeasures}
                  onChange={(e) => setEditMeasures(e.target.value)}
                  placeholder="Medidas"
                /><br />
                <input
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="URL de imagen"
                /><br />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Descripción"
                  style={{ width: "100%", height: "60px" }}
                />
                <br />
                <img
                  src={editImage}
                  alt="preview"
                  style={{ maxWidth: "100%", marginTop: "0.5rem" }}
                /><br />
                <button onClick={handleUpdate} style={{ marginRight: "0.5rem" }}>
                  💾 Guardar
                </button>
                <button onClick={() => setEditingProduct(null)}>❌ Cancelar</button>
              </div>
            ) : (
              <Link to={`/product/${subcategoryId}/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  textAlign: "center",
                  backgroundColor: "gray",
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>

                  <div>
                    <strong>{product.name}</strong>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>{product.measures}</div>
                  </div>
                </div>
              </Link>
            )}
            {isAdmin && !editingProduct && (
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{ marginRight: "0.5rem" }}
                >
                  ✏️ Editar
                </button>
                <button onClick={() => handleDelete(product.id)}>
                  🗑 Eliminar
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DynamicProductGrid;
