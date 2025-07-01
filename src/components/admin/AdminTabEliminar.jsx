import { useState, useEffect } from "react";
import { doc, deleteDoc, updateDoc, arrayRemove, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Stack, Paper, List, ListItem, ListItemText, IconButton, Divider, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminTabEliminar({ catalog, onDataChange }) {
  const [dataType, setDataType] = useState('products'); // Default to products
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setItems([]);
      let fetchedItems = [];
      
      try {
        if (dataType === 'categories') {
          fetchedItems = catalog;
        } 
        else if (dataType === 'subcategories') {
          fetchedItems = catalog.flatMap(cat => 
            (cat.subcategories || []).map(sub => ({...sub, catId: cat.id, catName: cat.name}))
          );
        }
        else if (dataType === 'products') {
          const allSubcategories = catalog.flatMap(cat => cat.subcategories || []);
          const productPromises = allSubcategories.map(sub => getDocs(collection(db, `products-${sub.id}`)));
          const productSnapshots = await Promise.all(productPromises);
          
          fetchedItems = productSnapshots.flatMap(snapshot => 
            snapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data(), 
              subcategoryId: doc.ref.parent.id.replace('products-', '') 
            }))
          );
        }
        else if (dataType === 'cortes') {
          const cortesSnapshot = await getDocs(collection(db, "cortes"));
          fetchedItems = cortesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // Apply search filter
        const filtered = fetchedItems.filter(item => 
          item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setItems(filtered);

      } catch (err) {
        console.error("Error fetching items to delete:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [dataType, catalog, searchTerm]);

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;

    try {
      if (dataType === 'categories') {
        await deleteDoc(doc(db, "categories", item.id));
      } 
      else if (dataType === 'subcategories') {
        const categoryDocRef = doc(db, "categories", item.catId);
        await updateDoc(categoryDocRef, {
          subcategories: arrayRemove({ id: item.id, name: item.name })
        });
      }
      else if (dataType === 'products') {
        await deleteDoc(doc(db, `products-${item.subcategoryId}`, item.id));
      }
      else if (dataType === 'cortes') {
        await deleteDoc(doc(db, "cortes", item.id));
      }

      alert("Elemento eliminado ✅");
      // For categories/subcategories, we refresh the main catalog
      if (dataType === 'categories' || dataType === 'subcategories') {
        onDataChange();
      } else {
        // For products/cortes, we just manually filter the item out of the list for instant UI feedback
        setItems(prevItems => prevItems.filter(i => i.id !== item.id));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error al eliminar el elemento.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Eliminar Elementos</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel>Tipo de Elemento</InputLabel>
          <Select value={dataType} label="Tipo de Elemento" onChange={(e) => setDataType(e.target.value)}>
            <MenuItem value="products">Productos</MenuItem>
            <MenuItem value="categories">Categorías</MenuItem>
            <MenuItem value="subcategories">Subcategorías</MenuItem>
            <MenuItem value="cortes">Tipos de Corte</MenuItem>
          </Select>
        </FormControl>
        <TextField 
          label="Buscar por nombre..." 
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Stack>
      <Paper elevation={2}>
        <List>
          {loading ? (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}><CircularProgress /></Box>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <div key={item.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={item.name} 
                    secondary={
                      (item.subcategoryId && `en ${item.subcategoryId}`) || 
                      (item.catName && `en ${item.catName}`) || null
                    }
                  />
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </div>
            ))
          ) : (
            <Alert severity="info" sx={{m: 2}}>No se encontraron elementos para el tipo seleccionado.</Alert>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default AdminTabEliminar;