// DynamicProductGrid.jsx
import { useEffect, useState } from "react";
import Footer from "./Footer";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./DynamicProductGrid.css"
import { db } from "../firebase";

// Receive catalog prop to find subcategory name
function DynamicProductGrid({ subcategoryId, isAdmin, catalog }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMeasures, setEditMeasures] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Find the current subcategory's name
  const currentSubcategory = catalog
    .flatMap(cat => cat.subcategories || [])
    .find(sub => sub.id === subcategoryId);

  useEffect(() => {
    if (!subcategoryId) {
      setProducts([]); // Clear products if no subcategoryId
      return;
    }

    const q = query(
      collection(db, `products-${subcategoryId}`),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });

    return () => unsubscribe();
  }, [subcategoryId]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await deleteDoc(doc(db, `products-${subcategoryId}`, id));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditMeasures(product.measures);
    setEditImage(product.image);
    setEditDescription(product.description || "");
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    await updateDoc(doc(db, `products-${subcategoryId}`, editingProduct.id), {
      name: editName,
      measures: editMeasures,
      image: editImage,
      description: editDescription,
    });
    setEditingProduct(null);
  };

  const handleViewProduct = (productId) => {
    window.location.href = `/product/${subcategoryId}/${productId}`;
  };

  // If no subcategoryId is selected, maybe show a message or nothing
  if (!subcategoryId) {
      return (
          <div className="product-grid-container">
              <h2 className="subcategory-title">Selecciona una subcategoría</h2>
          </div>
      );
  }

  return (
    <div className="product-grid-container"> {/* New wrapper for title and grid */}
      {currentSubcategory && (
        <h2 className="subcategory-title">
          {currentSubcategory.name}
        </h2>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {editingProduct?.id === product.id ? (
              <div className="product-edit-form">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  value={editMeasures}
                  onChange={(e) => setEditMeasures(e.target.value)}
                  placeholder="Medidas"
                />
                <input
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="URL de imagen"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Descripción"
                />
                <button onClick={handleUpdate}>Guardar</button>
                <button onClick={() => setEditingProduct(null)}>Cancelar</button>
              </div>
            ) : (
              <>
                <div
                  className="product-image-container"
                  onClick={() => handleViewProduct(product.id)}
                  role="link"
                  tabIndex="0"
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-measures">{product.measures}</p>
                  <p className="product-description">{product.description}</p>
                </div>

                {isAdmin && (
                  <div className="product-buttons">
                    <button onClick={() => handleEdit(product)}>Editar</button>
                    <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DynamicProductGrid;