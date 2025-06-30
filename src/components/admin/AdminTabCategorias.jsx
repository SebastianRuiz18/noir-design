// src/components/admin/AdminTabCategorias.jsx
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

import "./AdminTabCategorias.css"; // <--- Import the new CSS file

function AdminTabCategorias({ catalog }) {
  // --- CATEGORÍA ---
  const [newCategory, setNewCategory] = useState("");

  // --- SUBCATEGORÍA ---
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  // --- PRODUCTO ---
  const [productCat, setProductCat] = useState("");
  const [productSubcat, setProductSubcat] = useState("");
  const [productName, setProductName] = useState("");
  const [productMeasures, setProductMeasures] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // --- CORTE ---
  const [cutName, setCutName] = useState("");
  const [cutImage, setCutImage] = useState("");

  // --- HANDLERS ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Ingresa un nombre para la categoría.");
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory,
        subcategories: [],
      });
      alert("Categoría agregada ✅");
      setNewCategory("");
    } catch (err) {
      alert("Error al agregar categoría ❌");
      console.error(err);
    }
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategory || !newSubcategory.trim()) return alert("Selecciona una categoría y escribe el nombre.");
    try {
      // Find the category in your local catalog data
      const catDoc = catalog.find((c) => c.id === selectedCategory);
      if (!catDoc) return alert("Categoría no encontrada ❌");

      // Construct the updated subcategories array
      const updatedSubcats = [...catDoc.subcategories, {
        id: newSubcategory.toLowerCase().replace(/\s+/g, "-"), // Generate a slug-like ID
        name: newSubcategory,
      }];

      // IMPORTANT: Your `fetch('/api/updateCategory')` call here is specific to your backend setup.
      // If you are directly updating Firestore, you would typically use `updateDoc` on the specific category document.
      // For example:
      // const categoryRef = doc(db, "categories", selectedCategory);
      // await updateDoc(categoryRef, { subcategories: updatedSubcats });

      // Keeping your original API call structure for now:
      await fetch(`/api/updateCategory?catId=${selectedCategory}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Specify content type
        },
        body: JSON.stringify(updatedSubcats),
      });

      alert("Subcategoría agregada ✅");
      setNewSubcategory("");
      // You might need to trigger a re-fetch of the catalog or update local state
      // if `useCatalogFromFirebase` doesn't automatically detect changes.
    } catch (err) {
      alert("Error al agregar subcategoría ❌");
      console.error(err);
    }
  };

  const handleAddProduct = async () => {
    if (!productCat || !productSubcat || !productName || !productMeasures || !productImage) {
      return alert("Completa todos los campos del producto.");
    }
    try {
      await addDoc(collection(db, `products-${productSubcat}`), {
        name: productName,
        measures: productMeasures,
        image: productImage,
        description: productDescription,
        createdAt: new Date(),
      });
      alert("Producto agregado ✅");
      setProductName("");
      setProductMeasures("");
      setProductImage("");
      setProductDescription("");
    } catch (err) {
      alert("Error al agregar producto ❌");
      console.error(err);
    }
  };

  const handleAddCutShape = async () => {
    if (!cutName || !cutImage) return alert("Completa el nombre y la imagen del tipo de corte.");
    try {
      await addDoc(collection(db, "cortes"), {
        name: cutName,
        image: cutImage,
      });
      alert("Tipo de corte agregado ✅");
      setCutName("");
      setCutImage("");
    } catch (err) {
      alert("Error al agregar tipo de corte ❌");
      console.error(err);
    }
  };

  const subcategories = catalog.find(c => c.id === productCat)?.subcategories || [];

  return (
    <div className="admin-tab-content">
      {/* === CATEGORÍA === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Agregar nueva categoría</h3>
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Nombre categoría"
        />
        <button className="admin-add-button" onClick={handleAddCategory}>Agregar</button>
      </section>

      {/* === SUBCATEGORÍA === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Agregar nueva subcategoría</h3>
        <select
          className="admin-select" // FIXED: Removed the inline comment here
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">Selecciona categoría</option>
          {catalog.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={newSubcategory}
          onChange={e => setNewSubcategory(e.target.value)}
          placeholder="Nombre subcategoría"
        />
        <button className="admin-add-button" onClick={handleAddSubcategory}>Agregar</button>
      </section>

      {/* === PRODUCTO === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Agregar nuevo producto</h3>
        <select
          className="admin-select" // FIXED: Removed the inline comment here
          value={productCat}
          onChange={e => {
            setProductCat(e.target.value);
            setProductSubcat(""); // Reset subcategory when category changes
          }}
        >
          <option value="">Selecciona categoría</option>
          {catalog.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          className="admin-select" // FIXED: Removed the inline comment here
          value={productSubcat}
          onChange={e => setProductSubcat(e.target.value)}
          disabled={!productCat} // Disable if no category selected
        >
          <option value="">Selecciona subcategoría</option>
          {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={productName}
          onChange={e => setProductName(e.target.value)}
          placeholder="Nombre"
        />
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={productMeasures}
          onChange={e => setProductMeasures(e.target.value)}
          placeholder="Medidas"
        />
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={productImage}
          onChange={e => setProductImage(e.target.value)}
          placeholder="URL imagen"
        />
        <textarea
          className="admin-textarea" // FIXED: Removed the inline comment here
          value={productDescription}
          onChange={e => setProductDescription(e.target.value)}
          placeholder="Descripción"
        />
        <button className="admin-add-button" onClick={handleAddProduct}>Agregar</button>

        <div className="admin-image-preview">
          <h4 className="admin-preview-title">Preview:</h4>
          {productImage && <img src={productImage} alt="preview" className="admin-preview-image" />}
          <p className="admin-preview-text"><strong>{productName}</strong></p>
          <p className="admin-preview-text">{productMeasures}</p>
          <p className="admin-preview-text">{productDescription}</p>
        </div>
      </section>

      {/* === TIPO DE CORTE === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Agregar tipo de corte</h3>
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={cutName}
          onChange={e => setCutName(e.target.value)}
          placeholder="Nombre del corte"
        />
        <input
          className="admin-input" // FIXED: Removed the inline comment here
          value={cutImage}
          onChange={e => setCutImage(e.target.value)}
          placeholder="URL imagen"
        />
        <button className="admin-add-button" onClick={handleAddCutShape}>Agregar</button>
        <div className="admin-image-preview">
          <h4 className="admin-preview-title">Preview:</h4>
          {cutImage && <img src={cutImage} alt="cut preview" className="admin-preview-image" />}
          <p className="admin-preview-text">{cutName}</p>
        </div>
      </section>
    </div>
  );
}

export default AdminTabCategorias;