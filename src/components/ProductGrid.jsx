import "./ProductGrid.css"; // Import the CSS file for styling

function ProductGrid({ products }) {
    if (!products || products.length === 0) {
      return <p style={{ padding: "1rem" }}>No hay productos en esta subcategoría.</p>;
    }
  
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        padding: "1rem"
      }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.5rem",
              textAlign: "center"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: "100%", height: "auto", marginBottom: "0.5rem" }}
            />
            <div><strong>{product.name}</strong></div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>{product.measures}</div>
          </div>
        ))}
      </div>
    );
  }
  
  export default ProductGrid;
  