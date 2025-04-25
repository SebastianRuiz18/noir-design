import { useState, useCallback } from "react";
import { collection, addDoc, Timestamp, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { debounce } from "lodash";

function AdminPanel({ catalog }) {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [name, setName] = useState("");
  const [measures, setMeasures] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryForSubs, setSelectedCategoryForSubs] = useState("");
  const [newSubcategories, setNewSubcategories] = useState([""]);

  const selectedCategory = catalog.find(cat => cat.id === categoryId);

  const handleAddProduct = async () => {
    if (!subcategoryId || !name || !imageUrl || !measures || !description) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newProduct = {
      name,
      measures,
      image: imageUrl,
      description,
      createdAt: Timestamp.now(),
    };

    try {
      setLoading(true);
      await addDoc(collection(db, `products-${subcategoryId}`), newProduct);
      alert("Producto agregado correctamente ✅");
      setName("");
      setMeasures("");
      setImageUrl("");
      setDescription("");
    } catch (err) {
      console.error("Error al agregar producto:", err);
      alert("Error al agregar producto ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return alert("Ponle nombre a la categoría");

    const id = newCategoryName.toLowerCase().replace(/\s+/g, "-");

    try {
      await setDoc(doc(db, "categories", id), {
        name: newCategoryName,
        subcategories: []
      });
      alert("Categoría creada ✅");
      setNewCategoryName("");
    } catch (err) {
      console.error("Error al crear categoría:", err);
      alert("Error al crear categoría ❌");
    }
  };

  const handleAddSubcategories = async (e) => {
    e.preventDefault();
    if (!selectedCategoryForSubs) return alert("Selecciona una categoría");

    const ref = doc(db, "categories", selectedCategoryForSubs);
    const existing = catalog.find(cat => cat.id === selectedCategoryForSubs);
    const existingSubs = existing?.subcategories || [];

    const formattedSubs = newSubcategories
      .filter(name => name.trim())
      .map(name => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name
      }));

    try {
      await setDoc(ref, {
        ...existing,
        subcategories: [...existingSubs, ...formattedSubs]
      });
      alert("Subcategorías agregadas ✅");
      setNewSubcategories([""]);
    } catch (err) {
      console.error("Error al agregar subcategorías:", err);
      alert("Error al agregar subcategorías ❌");
    }
  };

  const handleSubNameChange = (index, value) => {
    const updated = [...newSubcategories];
    updated[index] = value;
    setNewSubcategories(updated);
  };

  const addNewSubField = () => {
    setNewSubcategories([...newSubcategories, ""]);
  };

  const debouncedUpdateCategoryName = useCallback(
    debounce(async (catId, newName) => {
      try {
        const ref = doc(db, "categories", catId);
        const existing = catalog.find(cat => cat.id === catId);
        await setDoc(ref, {
          ...existing,
          name: newName
        });
      } catch (err) {
        console.error("Error al editar categoría:", err);
      }
    }, 1000), [catalog]
  );

  const handleEditCategoryName = (catId, newName) => {
    debouncedUpdateCategoryName(catId, newName);
  };

  const debouncedUpdateSubcategoryName = useCallback(
    debounce(async (catId, subId, newName) => {
      try {
        const ref = doc(db, "categories", catId);
        const category = catalog.find(cat => cat.id === catId);
        const updatedSubs = category.subcategories.map(sub =>
          sub.id === subId ? { ...sub, name: newName } : sub
        );

        await setDoc(ref, {
          ...category,
          subcategories: updatedSubs
        });
      } catch (err) {
        console.error("Error al editar subcategoría:", err);
      }
    }, 1000), [catalog]
  );

  const handleEditSubcategory = (catId, subId, newName) => {
    debouncedUpdateSubcategoryName(catId, subId, newName);
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría con todas sus subcategorías?")) return;

    try {
      await deleteDoc(doc(db, "categories", catId));
      alert("Categoría eliminada");
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert("No se pudo eliminar");
    }
  };

  const handleDeleteSubcategory = async (catId, subId) => {
    if (!window.confirm("¿Eliminar esta subcategoría?")) return;

    try {
      const ref = doc(db, "categories", catId);
      const category = catalog.find(cat => cat.id === catId);
      const updated = category.subcategories.filter(sub => sub.id !== subId);

      await setDoc(ref, {
        ...category,
        subcategories: updated
      });
      alert("Subcategoría eliminada");
    } catch (err) {
      console.error("Error al eliminar subcategoría:", err);
      alert("Error al eliminar subcategoría");
    }
  };

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
      <h2>🛠 Admin Panel</h2>

      {/* Crear categoría */}
      <form onSubmit={handleCreateCategory} style={{ marginTop: "2rem" }}>
        <h3>➕ Crear nueva categoría</h3>
        <input
          placeholder="Nombre de la categoría (ej. Descuentos)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button type="submit">✅ Crear categoría</button>
      </form>

      {/* Agregar subcategorías */}
      <form onSubmit={handleAddSubcategories} style={{ marginTop: "2rem" }}>
        <h3>📁 Agregar subcategorías a una categoría existente</h3>
        <select
          value={selectedCategoryForSubs}
          onChange={(e) => setSelectedCategoryForSubs(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        >
          <option value="">Selecciona una categoría</option>
          {catalog.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {newSubcategories.map((sub, index) => (
          <input
            key={index}
            placeholder="Nombre visible (ej. Navidad)"
            value={sub}
            onChange={(e) => handleSubNameChange(index, e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
        ))}
        <button type="button" onClick={addNewSubField}>➕ Agregar campo</button><br /><br />
        <button type="submit">✅ Agregar subcategorías</button>
      </form>

      {/* Agregar producto */}
      <div style={{ marginTop: "2rem" }}>
        <h3>🛒 Agregar nuevo producto</h3>

        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ width: "100%" }}>
          <option value="">Selecciona categoría</option>
          {catalog.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <br /><br />
        <select value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)} style={{ width: "100%" }}>
          <option value="">Selecciona subcategoría</option>
          {selectedCategory?.subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        <br /><br />
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%" }} />
        <br /><br />
        <input placeholder="Medidas" value={measures} onChange={e => setMeasures(e.target.value)} style={{ width: "100%" }} />
        <br /><br />
        <input placeholder="URL de imagen" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ width: "100%" }} />
        <br /><br />
        <label>Descripción:</label><br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", height: "80px", marginBottom: "1rem" }}
        />

        <button onClick={handleAddProduct} disabled={loading}>
          {loading ? "Guardando..." : "Agregar producto"}
        </button>

        {/* Preview */}
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginTop: "2rem" }}>
          <h4>📦 Preview del producto</h4>
          <div style={{ display: "flex", gap: "1rem" }}>
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: "150px", height: "150px", objectFit: "contain", border: "1px solid #ddd" }}
            />
            <div>
              <strong>{name || "Nombre del producto"}</strong>
              <p>{description || "Descripción corta del producto"}</p>
              <p><em>{measures || "Medidas"}</em></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
