// src/components/admin/AdminTabEditar.jsx
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import {
  updateDoc,
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

import "./AdminTabEditar.css"; // <--- Import the new CSS file

function AdminTabEditar({ catalog }) {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [cutId, setCutId] = useState("");
  const [cuts, setCuts] = useState([]);
  const [products, setProducts] = useState([]);

  // fields for editing
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newMeasures, setNewMeasures] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCutName, setNewCutName] = useState("");
  const [newCutImage, setNewCutImage] = useState("");

  // Helper to find subcategories for a given category ID
  const getSubcategoriesForCategory = useCallback((catId) => {
    return catalog.find(c => c.id === catId)?.subcategories || [];
  }, [catalog]);

  // Effect to fetch products when subcategoryId changes
  useEffect(() => {
    if (!subcategoryId) {
      setProducts([]); // Clear products if no subcategory is selected
      setProductId(""); // Clear selected product
      return;
    }
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, `products-${subcategoryId}`));
      const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    };
    fetchProducts();
  }, [subcategoryId]);

  // Effect to fetch cuts when component mounts
  useEffect(() => {
    const fetchCuts = async () => {
      const querySnapshot = await getDocs(collection(db, "cortes"));
      const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCuts(list);
    };
    fetchCuts();
  }, []);

  // Effect to populate Category Name when categoryId changes
  useEffect(() => {
    if (categoryId) {
      const selectedCat = catalog.find(c => c.id === categoryId);
      setNewCategoryName(selectedCat ? selectedCat.name : "");
      setSubcategoryId(""); // Reset subcategory when category changes
    } else {
      setNewCategoryName("");
    }
  }, [categoryId, catalog]);

  // Effect to populate Subcategory Name when subcategoryId changes
  useEffect(() => {
    if (categoryId && subcategoryId) {
      const subcategories = getSubcategoriesForCategory(categoryId);
      const selectedSub = subcategories.find(sub => sub.id === subcategoryId);
      setNewSubcategoryName(selectedSub ? selectedSub.name : "");
      setProductId(""); // Reset product when subcategory changes
    } else {
      setNewSubcategoryName("");
    }
  }, [categoryId, subcategoryId, getSubcategoriesForCategory]);


  // Effect to populate Product fields when productId changes
  useEffect(() => {
    if (productId) {
      const selectedProduct = products.find(p => p.id === productId);
      if (selectedProduct) {
        setNewProductName(selectedProduct.name || "");
        setNewMeasures(selectedProduct.measures || "");
        setNewImageUrl(selectedProduct.image || "");
        setNewDescription(selectedProduct.description || "");
      }
    } else {
      setNewProductName("");
      setNewMeasures("");
      setNewImageUrl("");
      setNewDescription("");
    }
  }, [productId, products]);

  // Effect to populate Cut fields when cutId changes
  useEffect(() => {
    if (cutId) {
      const selectedCut = cuts.find(c => c.id === cutId);
      if (selectedCut) {
        setNewCutName(selectedCut.name || "");
        setNewCutImage(selectedCut.image || "");
      }
    } else {
      setNewCutName("");
      setNewCutImage("");
    }
  }, [cutId, cuts]);


  const updateCategory = async () => {
    if (!categoryId || !newCategoryName.trim()) return alert("Faltan datos para actualizar la categoría.");
    try {
      await updateDoc(doc(db, "categories", categoryId), { name: newCategoryName });
      alert("Categoría actualizada ✅");
      // Optionally, refresh catalog data here if useCatalogFromFirebase doesn't auto-update
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Error al actualizar categoría ❌");
    }
  };

  const updateSubcategory = async () => {
    if (!categoryId || !subcategoryId || !newSubcategoryName.trim()) return alert("Faltan datos para actualizar la subcategoría.");
    try {
      const ref = doc(db, "categories", categoryId);
      const subcategories = getSubcategoriesForCategory(categoryId);
      const updatedSubcategories = subcategories.map(sub =>
        sub.id === subcategoryId ? { ...sub, name: newSubcategoryName } : sub
      );
      // Assuming you're directly updating Firestore for subcategories, not via an API
      await updateDoc(ref, { subcategories: updatedSubcategories });
      alert("Subcategoría actualizada ✅");
      // Optionally, refresh catalog data here
    } catch (err) {
      console.error("Error updating subcategory:", err);
      alert("Error al actualizar subcategoría ❌");
    }
  };

  const updateProduct = async () => {
    if (!subcategoryId || !productId || !newProductName.trim() || !newMeasures.trim() || !newImageUrl.trim()) {
      return alert("Completa todos los campos del producto para actualizar.");
    }
    try {
      await updateDoc(doc(db, `products-${subcategoryId}`, productId), {
        name: newProductName,
        measures: newMeasures,
        image: newImageUrl,
        description: newDescription,
      });
      alert("Producto actualizado ✅");
      // Optionally, refresh product list here
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error al actualizar producto ❌");
    }
  };

  const updateCut = async () => {
    if (!cutId || !newCutName.trim() || !newCutImage.trim()) return alert("Faltan datos del corte para actualizar.");
    try {
      await updateDoc(doc(db, "cortes", cutId), {
        name: newCutName,
        image: newCutImage,
      });
      alert("Corte actualizado ✅");
      // Optionally, refresh cut list here
    } catch (err) {
      console.error("Error updating cut:", err);
      alert("Error al actualizar tipo de corte ❌");
    }
  };

  // Find the selected category's subcategories for the subcategory dropdown
  const subcategoriesForDropdown = getSubcategoriesForCategory(categoryId);

  return (
    <div className="admin-tab-content">
      {/* === CATEGORÍA === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Editar Categoría</h3>
        <select
          className="admin-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Selecciona categoría</option>
          {catalog.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          className="admin-input"
          placeholder="Nuevo nombre"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className="admin-update-button" onClick={updateCategory}>Actualizar categoría</button>
      </section>

      <div className="admin-section-separator"></div> {/* <--- Styled separator */}

      {/* === SUBCATEGORÍA === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Editar Subcategoría</h3>
        <select
          className="admin-select"
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          disabled={!categoryId} // Disable if no category selected
        >
          <option value="">Selecciona subcategoría</option>
          {subcategoriesForDropdown.map((sub) => ( // Use the filtered list
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        <input
          className="admin-input"
          placeholder="Nuevo nombre subcategoría"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          disabled={!subcategoryId} // Disable if no subcategory selected
        />
        <button className="admin-update-button" onClick={updateSubcategory}>Actualizar subcategoría</button>
      </section>

      <div className="admin-section-separator"></div> {/* <--- Styled separator */}

      {/* === PRODUCTO === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Editar Producto</h3>
        <select
          className="admin-select"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          disabled={!subcategoryId} // Disable if no subcategory selected
        >
          <option value="">Selecciona producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          className="admin-input"
          placeholder="Nuevo nombre"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          disabled={!productId} // Disable if no product selected
        />
        <input
          className="admin-input"
          placeholder="Medidas"
          value={newMeasures}
          onChange={(e) => setNewMeasures(e.target.value)}
          disabled={!productId}
        />
        <input
          className="admin-input"
          placeholder="URL imagen"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          disabled={!productId}
        />
        <textarea
          className="admin-textarea"
          placeholder="Descripción"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={!productId}
        />
        <button className="admin-update-button" onClick={updateProduct}>Actualizar producto</button>

        <div className="admin-image-preview">
          <h4 className="admin-preview-title">Vista previa:</h4>
          {newImageUrl && <img src={newImageUrl} alt="preview" className="admin-preview-image" />}
          <p className="admin-preview-text"><strong>{newProductName}</strong></p>
          <p className="admin-preview-text">{newMeasures}</p>
          <p className="admin-preview-text">{newDescription}</p>
        </div>
      </section>

      <div className="admin-section-separator"></div> {/* <--- Styled separator */}

      {/* === TIPO DE CORTE === */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Editar Tipo de Corte</h3>
        <select
          className="admin-select"
          value={cutId}
          onChange={(e) => setCutId(e.target.value)}
        >
          <option value="">Selecciona corte</option>
          {cuts.map(cut => (
            <option key={cut.id} value={cut.id}>{cut.name}</option>
          ))}
        </select>
        <input
          className="admin-input"
          placeholder="Nuevo nombre"
          value={newCutName}
          onChange={(e) => setNewCutName(e.target.value)}
          disabled={!cutId} // Disable if no cut selected
        />
        <input
          className="admin-input"
          placeholder="URL nueva imagen"
          value={newCutImage}
          onChange={(e) => setNewCutImage(e.target.value)}
          disabled={!cutId}
        />
        <button className="admin-update-button" onClick={updateCut}>Actualizar tipo de corte</button>

        <div className="admin-image-preview">
          <h4 className="admin-preview-title">Vista previa:</h4>
          {newCutImage && <img src={newCutImage} alt="preview" className="admin-preview-image" />}
          <p className="admin-preview-text">{newCutName}</p>
        </div>
      </section>
    </div>
  );
}

export default AdminTabEditar;