// ProductPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer";
import "./ProductPage.css";
import logo from "../assets/logo.png";

function ProductPage() {
  const { subcategory, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cutShapes, setCutShapes] = useState([]);

  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageWrapperRef = useRef(null);

  const zoomLevel = 2.5;
  const magnifierSize = 180;

  // Obtener producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, `products-${subcategory}`, productId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct(snap.data());
        } else {
          console.warn("Producto no encontrado:", productId);
          navigate('/');
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
        navigate('/');
      }
    };

    fetchProduct();
  }, [subcategory, productId, navigate]);

  // Obtener tipos de corte desde Firebase
  useEffect(() => {
    const fetchCutShapes = async () => {
      try {
        const snap = await getDocs(collection(db, "cortes"));
        const data = snap.docs.map(doc => doc.data());
        setCutShapes(data);
      } catch (error) {
        console.error("Error al obtener tipos de corte:", error);
      }
    };

    fetchCutShapes();
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles ✅");
  };

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

  if (!product) {
    return (
      <div className="product-page-container loading-state">
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <div className="product-detail-card">
        <div className="product-page-logo-container" onClick={() => navigate('/')}>
          <img src={logo} alt="Noir.Design Logo" className="product-page-logo" />
        </div>

        <button onClick={() => window.history.back()} className="back-button">
          ⬅ Volver
        </button>

        <div className="product-content">
          <div
            className="product-image-wrapper"
            ref={imageWrapperRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image-display"
            />
            {isZooming && <div className="magnifying-glass" style={zoomStyle}></div>}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <p className="description">{product.description}</p>
            <p className="measures">Medidas: {product.measures}</p>
            <button onClick={handleCopyLink} className="copy-link-button">
              Copiar enlace del producto
            </button>
          </div>
        </div>

        {/* Tipos de corte desde Firebase */}
        <div className="cut-shapes-section">
          <h2>Tipos de corte disponibles</h2>
          <div className="cut-shapes-grid">
            {cutShapes.map((cut) => (
              <div key={cut.name} className="cut-shape-item">
                <img src={cut.image} alt={cut.name} />
                <p>{cut.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
