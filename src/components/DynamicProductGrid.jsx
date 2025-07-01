import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "./DynamicProductGrid.css";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from '@mui/material';

function DynamicProductGrid({ subcategoryId, catalog }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Replaces 'error' for clearer messages
  const navigate = useNavigate();

  // Find the full subcategory object to get its name
  const currentSubcategory = catalog
    .flatMap(cat => cat.subcategories || [])
    .find(sub => sub.id === subcategoryId);

  useEffect(() => {
    if (!subcategoryId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");
    
    const collectionName = `products-${subcategoryId}`;
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // If the collection is empty, set a helpful message
      if (snapshot.empty) {
        setMessage(`No hay productos en la subcategoría "${currentSubcategory?.name || subcategoryId}" todavía.`);
      } else {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      }
      setLoading(false);
    }, (err) => {
      // This will catch Firestore permission errors or other issues
      console.error(`Error fetching from collection ${collectionName}:`, err);
      setMessage("Ocurrió un error al cargar los productos.");
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [subcategoryId, catalog]); // Rerun when subcategory or catalog changes

  const handleViewProduct = (productId) => {
    navigate(`/product/${subcategoryId}/${productId}`);
  };

  return (
    <div className="product-grid-container">
      <h2 className="subcategory-title">{currentSubcategory?.name}</h2>

      {/* Show a loading spinner while fetching */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* If there's a message (like "empty" or "error"), display it */}
      {message && !loading && (
        <Box sx={{ textAlign: 'center', p: 4, mt: 2, backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <Typography color="text.secondary">{message}</Typography>
        </Box>
      )}

      {/* Only show the grid if it's not loading and there are products */}
      {!loading && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => handleViewProduct(product.id)}>
              <div
                className="product-image-container"
                role="link"
                tabIndex="0"
              >
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-measures">{product.measures}</p>
                <p className="product-description">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DynamicProductGrid;