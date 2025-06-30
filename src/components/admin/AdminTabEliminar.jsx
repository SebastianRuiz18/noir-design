// src/components/admin/AdminTabEliminar.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  // Add updateDoc if you decide to update subcategories directly rather than delete their subcollection
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import "./AdminTabEliminar.css"; // <--- Import the new CSS file

function AdminTabEliminar({ catalog }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCutId, setSelectedCutId] = useState("");
  const [products, setProducts] = useState([]);
  const [cuts, setCuts] = useState([]);

  // Fetch all cuts for the "Eliminar Tipo de Corte" section
  useEffect(() => {
    const fetchCuts = async () => {
      try {
        const snap = await getDocs(collection(db, "cortes"));
        const result = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCuts(result);
      } catch (error) {
        console.error("Error fetching cuts:", error);
      }
    };
    fetchCuts();
  }, []);

  // Fetch products for the selected subcategory
  useEffect(() => {
    if (!selectedSubcategoryId) {
      setProducts([]); // Clear products if no subcategory selected
      setSelectedProductId(""); // Clear selected product
      return;
    }
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, `products-${selectedSubcategoryId}`));
        const result = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [selectedSubcategoryId]);

  // Handle category change (for subcategory and product dropdowns)
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSubcategoryId(""); // Reset subcategory when category changes
    setSelectedProductId(""); // Reset product when category changes
  };

  // Handle subcategory change (for product dropdown)
  const handleSubcategoryChange = (e) => {
    setSelectedSubcategoryId(e.target.value);
    setSelectedProductId(""); // Reset product when subcategory changes
  };

  const confirmAndDelete = async (ref, label, type) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar "${label}"? Esta acción no se puede deshacer.`)) {
      try {
        if (type === "subcategory") {
          // Special handling for subcategories: update the parent category's subcategories array
          const categoryRef = doc(db, "categories", selectedCategoryId);
          const currentCategory = catalog.find(c => c.id === selectedCategoryId);
          if (currentCategory) {
            const updatedSubcategories = currentCategory.subcategories.filter(
              (sub) => sub.id !== selectedSubcategoryId
            );
            await updateDoc(categoryRef, { subcategories: updatedSubcategories });
            alert(`Subcategoría "${label}" eliminada ✅`);
            // You might need to also delete the product collection associated with this subcategory
            // This is a more complex operation involving listing and deleting documents in the subcollection.
            // For now, we're only removing it from the category's subcategories array.
            // If you need to delete the `products-subcategoryId` collection, you'll need a backend function or more advanced client-side code.
          } else {
            alert("Categoría no encontrada para actualizar subcategoría.");
          }
        } else {
          await deleteDoc(ref);
          alert(`Elemento "${label}" eliminado ✅`);
        }
        // A simple reload is often sufficient for admin panels to ensure data consistency
        window.location.reload();
      } catch (error) {
        console.error(`Error deleting ${label}:`, error);
        alert(`Error al eliminar "${label}" ❌`);
      }
    }
  };

  const subcategoriesForSelectedCategory = catalog.find((c) => c.id === selectedCategoryId)?.subcategories || [];

  return (
    <div className="admin-tab-content">
      {/* Eliminar Categoría */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Eliminar Categoría</h3>
        <select
          className="admin-select"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Selecciona una categoría</option>
          {catalog.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          className="admin-delete-button"
          onClick={() =>
            confirmAndDelete(
              doc(db, "categories", selectedCategoryId),
              catalog.find(c => c.id === selectedCategoryId)?.name || "Categoría",
              "category"
            )
          }
          disabled={!selectedCategoryId}
        >
          🗑️ Eliminar Categoría
        </button>
      </section>

      <div className="admin-section-separator"></div>

      {/* Eliminar Subcategoría */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Eliminar Subcategoría</h3>
        <select
          className="admin-select"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Selecciona una categoría</option>
          {catalog.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="admin-select"
          value={selectedSubcategoryId}
          onChange={handleSubcategoryChange}
          disabled={!selectedCategoryId}
        >
          <option value="">Selecciona una subcategoría</option>
          {subcategoriesForSelectedCategory.map((sub) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        <button
          className="admin-delete-button"
          onClick={() =>
            confirmAndDelete(
              // For subcategories, we update the parent category's subcategories array
              // The actual document deletion is handled by updating the parent.
              null, // No direct doc ref for subcategory deletion via array update
              subcategoriesForSelectedCategory.find(sub => sub.id === selectedSubcategoryId)?.name || "Subcategoría",
              "subcategory" // Indicate type for special handling in confirmAndDelete
            )
          }
          disabled={!selectedCategoryId || !selectedSubcategoryId}
        >
          🗑️ Eliminar Subcategoría
        </button>
      </section>

      <div className="admin-section-separator"></div>

      {/* Eliminar Producto */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Eliminar Producto</h3>
        {/* Category selection to narrow down subcategories */}
        <select
          className="admin-select"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Selecciona una categoría</option>
          {catalog.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {/* Subcategory selection to load products */}
        <select
          className="admin-select"
          value={selectedSubcategoryId}
          onChange={handleSubcategoryChange}
          disabled={!selectedCategoryId}
        >
          <option value="">Selecciona una subcategoría</option>
          {subcategoriesForSelectedCategory.map((sub) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        {/* Product selection */}
        <select
          className="admin-select"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={!selectedSubcategoryId}
        >
          <option value="">Selecciona un producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button
          className="admin-delete-button"
          onClick={() =>
            confirmAndDelete(
              doc(db, `products-${selectedSubcategoryId}`, selectedProductId),
              products.find(p => p.id === selectedProductId)?.name || "Producto",
              "product"
            )
          }
          disabled={!selectedProductId}
        >
          🗑️ Eliminar Producto
        </button>
      </section>

      <div className="admin-section-separator"></div>

      {/* Eliminar Tipo de Corte */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Eliminar Tipo de Corte</h3>
        <select
          className="admin-select"
          value={selectedCutId}
          onChange={(e) => setSelectedCutId(e.target.value)}
        >
          <option value="">Selecciona un tipo de corte</option>
          {cuts.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          className="admin-delete-button"
          onClick={() =>
            confirmAndDelete(
              doc(db, "cortes", selectedCutId),
              cuts.find(c => c.id === selectedCutId)?.name || "Tipo de corte",
              "cut"
            )
          }
          disabled={!selectedCutId}
        >
          🗑️ Eliminar Tipo de Corte
        </button>
      </section>
    </div>
  );
}

export default AdminTabEliminar;