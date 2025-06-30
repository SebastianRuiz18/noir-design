// src/Admin.jsx
import React, { useState, useEffect } from "react";
import useCatalogFromFirebase from "./hooks/useCatalogFromFirebase";
import Navbar from "./components/Navbar";
import DynamicProductGrid from "./components/DynamicProductGrid";
import Login from "./components/Login";
import AdminPanel from "./components/Adminpanel";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import "./Admin.css"; // <--- Import the new CSS file

function Admin() {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("crear");
  const catalog = useCatalogFromFirebase();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(currentUser.email === "seruci93@gmail.com"); // Your admin email
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []); // Run once on component mount

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to home or login page after logout
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error al cerrar sesión", error);
      });
  };

  if (!user) {
    return (
      <Login
        onLogin={(u) => {
          setUser(u);
          setIsAdmin(u.email === "seruci93@gmail.com");
        }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-access-denied"> {/* <--- Added class name */}
        <h2 className="admin-denied-heading">No tienes permiso para ver esta sección 🔒</h2> {/* <--- Added class name */}
        <p className="admin-denied-message">Por favor, cierra sesión y usa el correo autorizado.</p> {/* <--- Added class name */}
      </div>
    );
  }

  return (
    <div className="admin-page-container"> {/* <--- Added class name */}
      {/* Assuming Navbar acts as a sidebar, and already has its own styling */}
      <Navbar catalog={catalog} onSelectSubcategory={setSelectedSubcategory} />
      
      <main className="admin-main-content"> {/* <--- Added class name */}
        <div className="admin-header"> {/* <--- Added class name */}
          <h2 className="admin-header-title"> {/* <--- Added class name */}
            {selectedSubcategory
              ? `${selectedSubcategory.name}`
              : activeTab === "crear"
              ? "Agregar"
              : activeTab === "editar"
              ? "Editar"
              : "Eliminar"}
          </h2>

          <div className="admin-user-info"> {/* <--- Added class name */}
            <span className="admin-username"> {/* <--- Added class name */}
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="admin-logout-button" // <--- Already fixed, no inline comment needed here
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Botones de pestañas */}
        <div className="admin-tab-buttons-container"> {/* <--- Added class name */}
          <button
            className={`admin-tab-button ${activeTab === "crear" ? "active" : ""}`}
            onClick={() => setActiveTab("crear")}
          >
            ➕ Agregar
          </button>
          <button
            className={`admin-tab-button ${activeTab === "editar" ? "active" : ""}`}
            onClick={() => setActiveTab("editar")}
          >
            ✏️ Editar
          </button>
          <button
            className={`admin-tab-button ${activeTab === "eliminar" ? "active" : ""}`}
            onClick={() => setActiveTab("eliminar")}
          >
            🗑️ Eliminar
          </button>
        </div>

        {selectedSubcategory && (
          <DynamicProductGrid
            subcategoryId={selectedSubcategory.id}
            isAdmin={true}
          />
        )}

        {/* Here, we pass the active tab to the AdminPanel */}
        <AdminPanel catalog={catalog} activeTab={activeTab} />
      </main>
    </div>
  );
}

export default Admin;