import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import "./ProductPage.css";
import { Box, CircularProgress, Alert } from "@mui/material";

function ProductPage() {
  const { subcategory, productId } = useParams();
  const navigate = useNavigate();
  const { catalog } = useCatalogFromFirebase();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cutShapes, setCutShapes] = useState([]);

  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageWrapperRef = useRef(null);
  const zoomLevel = 2.5;
  const magnifierSize = 180;

  // Fetch product logic...
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, `products-${subcategory}`, productId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct(snap.data());
        } else {
          setError("Este producto no fue encontrado.");
        }
      } catch (err) {
        setError("Ocurrió un error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [subcategory, productId]);
  
  // Fetch cut shapes logic...
  useEffect(() => {
    if (product && (product.variationType !== 'color_variations' || product.showCutShapesWithColor === true)) {
      const fetchCutShapes = async () => {
        try {
          const snap = await getDocs(collection(db, "cortes"));
          setCutShapes(snap.docs.map(doc => doc.data()));
        } catch (error) {
          console.error("Error fetching cut shapes:", error);
        }
      };
      fetchCutShapes();
    }
  }, [product]);

  // **THE FIX IS HERE:** Restored the logic for the copy link function.
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Enlace copiado al portapapeles ✅");
  };
  
  // Zoom event handlers...
  const handleMouseMove = (e) => {
    if (!imageWrapperRef.current || !product?.image) return;
    const { left, top, width, height } = imageWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const magnifierLeft = x - magnifierSize / 2;
    const magnifierTop = y - magnifierSize / 2;
    const bgXPercent = (x / width) * 100;
    const bgYPercent = (y / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${product.image})`,
      backgroundPosition: `${bgXPercent}% ${bgYPercent}%`,
      backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`,
      left: `${magnifierLeft}px`,
      top: `${magnifierTop}px`,
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
    });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <div className="product-page-container">
      <Navbar catalog={catalog} />
      <div className="product-detail-card">
        <button onClick={() => navigate(-1)} className="back-button">⬅ Volver</button>
        {product && (
          <>
            <div className="product-content">
              <div
                className="product-image-wrapper"
                ref={imageWrapperRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img src={product.image} alt={product.name} className="product-image-display" />
                {isZooming && <div className="magnifying-glass" style={zoomStyle}></div>}
              </div>
              <div className="product-info-section">
                <h1>{product.name}</h1>
                <p className="description">{product.description}</p>
                <p className="measures">Medidas: {product.measures}</p>
                <button onClick={handleCopyLink} className="copy-link-button">Copiar enlace del producto</button>
              </div>
            </div>
            
            {/* Variation logic is unchanged */}
            {product.variationType === 'color_variations' && (
              <div className="variations-section">
                <h2>Variaciones de Color</h2>
                <div className="variation-grid">
                  {product.colorVariations?.map((color, index) => (
                    <div key={index} className="variation-item">
                      <img src={color.image} alt={color.name} />
                      <p>{color.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(product.variationType !== 'color_variations' || product.showCutShapesWithColor) && (
              <div className="variations-section">
                <h2>Tipos de corte disponibles</h2>
                <div className="variation-grid">
                  {cutShapes.map((cut, index) => (
                    <div key={index} className="variation-item">
                      <img src={cut.image} alt={cut.name} />
                      <p>{cut.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;