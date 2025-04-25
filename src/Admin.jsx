import React, { useState } from 'react';
import useCatalogFromFirebase from './hooks/useCatalogFromFirebase';
import Navbar from './components/Navbar';
import DynamicProductGrid from './components/DynamicProductGrid';
import Login from './components/Login';
import AdminPanel from './components/Adminpanel';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function Admin() {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const catalog = useCatalogFromFirebase();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error("Error al cerrar sesión", error);
      });
  };

  if (!user) {
    return <Login onLogin={(u) => {
      setUser(u);
      setIsAdmin(u.email === "seruci93@gmail.com");
    }} />;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>No tienes permiso para ver esta sección 🔒</h2>
        <p>Por favor, cierra sesión y usa el correo autorizado.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar catalog={catalog} onSelectSubcategory={setSelectedSubcategory} />
      <main style={{ flex: 1 }}>
        <div style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2>
            {selectedSubcategory ? selectedSubcategory.name : "Selecciona una subcategoría del menú"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>{user.displayName}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "#f44336",
                color: "#fff",
                padding: "6px 10px",
                fontSize: "0.9rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {selectedSubcategory && (
          <DynamicProductGrid subcategoryId={selectedSubcategory.id} isAdmin={true} />
        )}

        <AdminPanel catalog={catalog} />
      </main>
    </div>
  );
}

export default Admin;
