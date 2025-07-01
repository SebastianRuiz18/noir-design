import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Stack, RadioGroup, FormControlLabel, Radio, Paper, IconButton, Chip, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


function AdminTabCategorias({ catalog, onDataChange }) {
  // --- All state variables remain the same ---
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [cutName, setCutName] = useState("");
  const [cutImage, setCutImage] = useState("");
  const [productCat, setProductCat] = useState("");
  const [productSubcat, setProductSubcat] = useState("");
  const [productName, setProductName] = useState("");
  const [productMeasures, setProductMeasures] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [variationType, setVariationType] = useState('tipos_de_corte'); 
  const [colorVariations, setColorVariations] = useState([]);
  const [currentColorName, setCurrentColorName] = useState("");
  const [currentColorImage, setCurrentColorImage] = useState("");
  const [showCutShapesWithColor, setShowCutShapesWithColor] = useState(false);

  // --- All handler functions are now complete and correct ---
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Ingresa un nombre para la categoría.");
    try {
      await addDoc(collection(db, "categories"), { name: newCategory, image: "", subcategories: [] });
      alert("Categoría agregada ✅"); setNewCategory(""); onDataChange(); 
    } catch (err) { alert("Error al agregar categoría ❌"); console.error(err); }
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategory || !newSubcategory.trim()) return alert("Selecciona una categoría y escribe un nombre.");
    try {
      const categoryDocRef = doc(db, "categories", selectedCategory);
      const newSubcategoryObject = { id: newSubcategory.toLowerCase().replace(/\s+/g, "-").trim(), name: newSubcategory.trim() };
      await updateDoc(categoryDocRef, { subcategories: arrayUnion(newSubcategoryObject) });
      alert("Subcategoría agregada ✅"); setNewSubcategory(""); onDataChange(); 
    } catch (err) { console.error("Error adding subcategory:", err); alert("Error al agregar la subcategoría."); }
  };
  
  const handleAddCutShape = async () => {
    if (!cutName || !cutImage) return alert("Completa el nombre y la imagen.");
    try {
      await addDoc(collection(db, "cortes"), { name: cutName, image: cutImage });
      alert("Tipo de corte agregado ✅"); setCutName(""); setCutImage("");
    } catch (err) { alert("Error al agregar tipo de corte ❌"); console.error(err); }
  };

  // **THE FIX IS HERE:** Restored the working code for this function.
  const handleAddColor = () => {
    if (!currentColorName || !currentColorImage) {
      alert("Por favor, ingresa el nombre y la URL de la imagen del color.");
      return;
    }
    setColorVariations([...colorVariations, { name: currentColorName, image: currentColorImage }]);
    setCurrentColorName("");
    setCurrentColorImage("");
  };

  const handleRemoveColor = (indexToRemove) => {
    setColorVariations(colorVariations.filter((_, index) => index !== indexToRemove));
  };

  const handleAddProduct = async () => {
    if (!productCat || !productSubcat || !productName || !productImage) {
      return alert("Completa los campos principales del producto (Categoría, Subcategoría, Nombre, Imagen).");
    }
    let productData = {
      name: productName, measures: productMeasures, image: productImage,
      description: productDescription, createdAt: serverTimestamp(),
      variationType: variationType
    };
    if (variationType === 'color_variations') {
      if (colorVariations.length === 0) return alert("Por favor, agrega al menos una variación de color.");
      productData.colorVariations = colorVariations;
      productData.showCutShapesWithColor = showCutShapesWithColor;
    }
    try {
      await addDoc(collection(db, `products-${productSubcat}`), productData);
      alert("Producto agregado ✅");
      setProductCat(""); setProductSubcat(""); setProductName("");
      setProductMeasures(""); setProductImage(""); setProductDescription("");
      setVariationType('tipos_de_corte'); setColorVariations([]);
      setCurrentColorName(""); setCurrentColorImage("");
      setShowCutShapesWithColor(false);
    } catch (err) { alert("Error al agregar el producto ❌"); console.error(err); }
  };

  const subcategories = catalog.find(c => c.id === productCat)?.subcategories || [];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
        
        {/* Other forms remain here */}
        <Box component="section" sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Agregar Nueva Categoría</Typography>
            <Stack spacing={2}>
              <TextField label="Nombre categoría" variant="outlined" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
              <Button variant="contained" onClick={handleAddCategory}>Agregar</Button>
            </Stack>
        </Box>
        <Box component="section" sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Agregar Nueva Subcategoría</Typography>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Categoría Principal</InputLabel>
                <Select value={selectedCategory} label="Categoría Principal" onChange={e => setSelectedCategory(e.target.value)}>
                  {catalog.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Nombre subcategoría" variant="outlined" value={newSubcategory} onChange={e => setNewSubcategory(e.target.value)} />
              <Button variant="contained" onClick={handleAddSubcategory}>Agregar</Button>
            </Stack>
        </Box>

        {/* --- UPDATED "ADD PRODUCT" FORM --- */}
        <Box component="section" sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, gridColumn: '1 / -1' }}>
            <Typography variant="h6" gutterBottom>Agregar Nuevo Producto</Typography>
            <Stack spacing={2}>
                <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select value={productCat} label="Categoría" onChange={e => { setProductCat(e.target.value); setProductSubcat(""); }}>
                        {catalog.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth disabled={!productCat}>
                    <InputLabel>Subcategoría</InputLabel>
                    <Select value={productSubcat} label="Subcategoría" onChange={e => setProductSubcat(e.target.value)}>
                        {subcategories.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField label="Nombre del Producto" variant="outlined" value={productName} onChange={e => setProductName(e.target.value)} />
                <TextField label="URL de Imagen Principal" variant="outlined" value={productImage} onChange={e => setProductImage(e.target.value)} />
                <TextField label="Medidas" variant="outlined" value={productMeasures} onChange={e => setProductMeasures(e.target.value)} />
                <TextField label="Descripción" variant="outlined" multiline rows={3} value={productDescription} onChange={e => setProductDescription(e.target.value)} />

                <FormControl component="fieldset">
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Opciones del Producto</Typography>
                    <RadioGroup row value={variationType} onChange={(e) => setVariationType(e.target.value)}>
                        <FormControlLabel value="tipos_de_corte" control={<Radio />} label="Mostrar Tipos de Corte" />
                        <FormControlLabel value="color_variations" control={<Radio />} label="Mostrar Variaciones de Color" />
                    </RadioGroup>
                </FormControl>

                {variationType === 'color_variations' && (
                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fcfcfc' }}>
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              checked={showCutShapesWithColor} 
                              onChange={(e) => setShowCutShapesWithColor(e.target.checked)} 
                            />} 
                          label="Mostrar también los Tipos de Corte globales" 
                        />
                        <Typography variant="subtitle2" gutterBottom sx={{mt: 2}}>Define los colores para este producto:</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <TextField size="small" label="Nombre del Color" value={currentColorName} onChange={(e) => setCurrentColorName(e.target.value)} />
                            <TextField size="small" label="URL Imagen del Color" value={currentColorImage} onChange={(e) => setCurrentColorImage(e.target.value)} sx={{flexGrow: 1}}/>
                            <Button variant="outlined" onClick={handleAddColor} startIcon={<AddIcon />}>Agregar</Button>
                        </Stack>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {colorVariations.map((color, index) => (
                                <Chip
                                    key={index}
                                    label={color.name}
                                    onDelete={() => handleRemoveColor(index)}
                                    deleteIcon={<DeleteIcon />}
                                />
                            ))}
                        </Stack>
                    </Paper>
                )}
                
                <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2, p: 1.5 }}>
                    Guardar Producto
                </Button>
            </Stack>
        </Box>
        
        {/* Cut Shape form */}
        <Box component="section" sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Agregar Tipo de Corte</Typography>
            <Stack spacing={2}>
              <TextField label="Nombre del corte" variant="outlined" value={cutName} onChange={e => setCutName(e.target.value)} />
              <TextField label="URL Imagen del corte" variant="outlined" value={cutImage} onChange={e => setCutImage(e.target.value)} />
              <Button variant="contained" onClick={handleAddCutShape}>Agregar</Button>
            </Stack>
        </Box>
    </Box>
  );
}

export default AdminTabCategorias;