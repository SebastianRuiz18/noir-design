function Navbar({ catalog, onSelectSubcategory }) {
  return (
    <nav style={{
      width: "250px",
      padding: "1rem",
      borderRight: "1px solid #444",
      backgroundColor: "#2c2c2c", // Fondo oscuro
      height: "100vh",
      overflowY: "auto",
      fontFamily: "sans-serif",
      color: "#fff"
    }}>
      <h2 style={{
        marginBottom: "1.5rem",
        fontSize: "1.3rem",
        fontWeight: "bold",
        color: "#fff"
      }}>
        Catálogo
      </h2>

      {catalog.map(category => (
        <div key={category.id} style={{ marginBottom: "1rem" }}>
          {/* Nombre de la categoría */}
          <div style={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#ffffff",
            marginBottom: "0.3rem"
          }}>
            {category.name}
          </div>

          {/* Subcategorías */}
          <ul style={{
            listStyleType: "disc",
            paddingLeft: "1.5rem",
            color: "#ccc",
            fontSize: "0.95rem"
          }}>
            {category.subcategories && category.subcategories.map(sub => (
              <li
                key={`${category.id}-${sub.id || sub.name}`}
                style={{
                  cursor: "pointer",
                  marginBottom: "0.3rem",
                }}
                onClick={() => onSelectSubcategory(sub)}
              >
                {sub.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default Navbar;
