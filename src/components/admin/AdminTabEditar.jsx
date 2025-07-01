import { useState, useEffect } from "react";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Stack, Paper, List, ListItemButton, ListItemText, CircularProgress, Alert } from '@mui/material';

function AdminTabEditar({ catalog, onDataChange }) {
  const [dataType, setDataType] = useState("products"); // Default to products as it's most common
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for the selected item and its form fields
  const [selectedItem, setSelectedItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editMeasures, setEditMeasures] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setItems([]);
      setSelectedItem(null); // Clear selection when type changes
      let fetchedItems = [];
      
      try {
        if (dataType === 'categories') {
          fetchedItems = catalog.map(cat => ({ ...cat, type: 'category' }));
        } 
        else if (dataType === 'subcategories') {
          fetchedItems = catalog.flatMap(cat => 
            (cat.subcategories || []).map(sub => ({ ...sub, type: 'subcategory', parentCategory: cat }))
          );
        }
        else if (dataType === 'products') {
          const allSubcategories = catalog.flatMap(cat => cat.subcategories || []);
          const productPromises = allSubcategories.map(sub => getDocs(collection(db, `products-${sub.id}`)));
          const productSnapshots = await Promise.all(productPromises);
          
          fetchedItems = productSnapshots.flatMap(snapshot => 
            snapshot.docs.map(doc => ({ 
              id: doc.id, ...doc.data(), type: 'product',
              subcategoryId: doc.ref.parent.id.replace('products-', '') 
            }))
          );
        }
        else if (dataType === 'cortes') {
          const cortesSnapshot = await getDocs(collection(db, "cortes"));
          fetchedItems = cortesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'corte' }));
        }
        setItems(fetchedItems);
      } catch (err) {
        console.error(`Error fetching ${dataType}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [dataType, catalog]);

  // When an item is selected from the list, populate the form fields
  const handleSelect = (item) => {
    setSelectedItem(item);
    setEditName(item.name || "");
    setEditImage(item.image || "");
    setEditMeasures(item.measures || "");
    setEditDescription(item.description || "");
  };
  
  // The main update function
  const handleUpdate = async () => {
    if (!selectedItem) return;

    let docRef;
    let updatedData = {};

    try {
      if (selectedItem.type === 'category') {
        docRef = doc(db, "categories", selectedItem.id);
        updatedData = { name: editName };
      } 
      else if (selectedItem.type === 'subcategory') {
        docRef = doc(db, "categories", selectedItem.parentCategory.id);
        const subIndex = selectedItem.parentCategory.subcategories.findIndex(s => s.id === selectedItem.id);
        if (subIndex === -1) throw new Error("Subcategory not found.");
        
        const updatedSubcategories = [...selectedItem.parentCategory.subcategories];
        updatedSubcategories[subIndex] = { ...updatedSubcategories[subIndex], name: editName };
        updatedData = { subcategories: updatedSubcategories };
      }
      else if (selectedItem.type === 'product') {
        docRef = doc(db, `products-${selectedItem.subcategoryId}`, selectedItem.id);
        updatedData = { name: editName, measures: editMeasures, image: editImage, description: editDescription };
      }
      else if (selectedItem.type === 'corte') {
        docRef = doc(db, "cortes", selectedItem.id);
        updatedData = { name: editName, image: editImage };
      }

      await updateDoc(docRef, updatedData);
      
      alert("Elemento actualizado ✅");
      setSelectedItem(null); // Clear form
      onDataChange(); // Refresh catalog data
    } catch (err) {
      console.error("Error updating document:", err);
      alert("Error al actualizar el elemento.");
    }
  };

  const renderEditForm = () => {
    if (!selectedItem) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 5, border: '2px dashed #e0e0e0', borderRadius: 2, height: '100%' }}>
          <Typography variant="h6" color="text.secondary">Selecciona un elemento de la lista para editar.</Typography>
        </Box>
      );
    }
    
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Editando: {selectedItem.name}</Typography>
        <Stack spacing={2}>
          <TextField label="Nombre" variant="outlined" fullWidth value={editName} onChange={(e) => setEditName(e.target.value)} />

          {/* Show fields specific to Products and Cortes */}
          {(selectedItem.type === 'product' || selectedItem.type === 'corte') && (
            <TextField label="URL de Imagen" variant="outlined" fullWidth value={editImage} onChange={(e) => setEditImage(e.target.value)} />
          )}

          {/* Show fields specific to Products */}
          {selectedItem.type === 'product' && (
            <>
              <TextField label="Medidas" variant="outlined" fullWidth value={editMeasures} onChange={(e) => setEditMeasures(e.target.value)} />
              <TextField label="Descripción" variant="outlined" multiline rows={4} fullWidth value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </>
          )}

          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>Actualizar</Button>
            <Button variant="outlined" onClick={() => setSelectedItem(null)}>Cancelar</Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Editar Elementos</Typography>
      <FormControl sx={{ minWidth: 240, mb: 2 }}>
        <InputLabel>Tipo de Elemento</InputLabel>
        <Select value={dataType} label="Tipo de Elemento" onChange={(e) => setDataType(e.target.value)}>
          <MenuItem value="products">Productos</MenuItem>
          <MenuItem value="categories">Categorías</MenuItem>
          <MenuItem value="subcategories">Subcategorías</MenuItem>
          <MenuItem value="cortes">Tipos de Corte</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 350px)' }}>
        <Paper elevation={2} sx={{ width: 350, overflowY: 'auto' }}>
          <List>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : items.length > 0 ? (
              items.map(item => (
                <ListItemButton 
                  key={`${item.type}-${item.id}`} 
                  selected={selectedItem?.id === item.id}
                  onClick={() => handleSelect(item)}
                >
                  <ListItemText 
                    primary={item.name} 
                    secondary={
                      (item.type === 'subcategory' && `en ${item.parentCategory.name}`) || 
                      (item.type === 'product' && `en ${item.subcategoryId}`) || null
                    }
                  />
                </ListItemButton>
              ))
            ) : (
              <Alert severity="info" sx={{ m: 2 }}>No se encontraron elementos.</Alert>
            )}
          </List>
        </Paper>

        <Box sx={{ flexGrow: 1 }}>
          {renderEditForm()}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminTabEditar;