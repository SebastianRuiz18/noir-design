import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";
import { Box, CircularProgress, Alert } from "@mui/material";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { catalog, loading: catalogLoading } = useCatalogFromFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    if (catalogLoading) {
      return;
    }

    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const allSubcategories = catalog.flatMap(cat => cat.subcategories || []);
        if (allSubcategories.length === 0) {
          setError("No subcategories found in catalog.");
          setLoading(false);
          return;
        }

        const promises = allSubcategories.map(sub => {
          const productsRef = collection(db, `products-${sub.id}`);
          const q = query(productsRef, orderBy("createdAt", "desc"), limit(5));
          return getDocs(q);
        });

        const allSnapshots = await Promise.all(promises);
        const allProducts = allSnapshots.flatMap(snapshot =>
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            subcategoryId: doc.ref.parent.id.replace('products-', '')
          }))
        );

        allProducts.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
        const latestProducts = allProducts.slice(0, 5);

        if (latestProducts.length === 0) {
          setError("No featured products found.");
        } else {
          setProducts(latestProducts);
        }

      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Could not load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [catalog, catalogLoading]);

  const handleViewProduct = (subcategoryId, productId) => {
    navigate(`/product/${subcategoryId}/${productId}`);
  };

  if (loading || catalogLoading) {
    return (
      <section className="featured-products-section" style={{ padding: 'var(--spacing-xxl) var(--spacing-lg)', textAlign: 'center' }}>
        <h3>Nuestras Colecciones Destacadas</h3>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-products-section" style={{ padding: 'var(--spacing-xxl) var(--spacing-lg)', textAlign: 'center' }}>
        <h3>Nuestras Colecciones Destacadas</h3>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </section>
    );
  }

  return (
    <section
      id="featured-collections"
      className="featured-products-section"
      style={{ padding: 'var(--spacing-xxl) var(--spacing-lg)', textAlign: 'center' }}
    >
      <h3>Nuestras Colecciones Destacadas</h3>
      <p className="section-subtitle">Los 5 diseños más recientes de nuestro catálogo</p>

      <div className="featured-product-grid">
        {products.map((product) => (
          <div key={product.id} className="featured-product-card" onClick={() => handleViewProduct(product.subcategoryId, product.id)}>
            <div className="image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="info">
              <h3 className="name">{product.name}</h3>
              <p className="measures">{product.measures}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="secondary-button enhanced-button" style={{ marginTop: '2rem' }} onClick={() => document.querySelector('.hamburger-icon')?.click()}>
        <span>Ver Catálogo Completo</span>
      </button>
    </section>
  );
}

export default FeaturedProducts;