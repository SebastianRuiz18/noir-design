// src/components/Adminpanel.jsx
import React from "react";
import AdminTabCategorias from "./admin/AdminTabCategorias";
import AdminTabEditar from "././admin/AdminTabEditar"; // Make sure path is correct
import AdminTabEliminar from "././admin/AdminTabEliminar"; // Make sure path is correct

import "./AdminPanel.css"; // <--- Import the new CSS file

function AdminPanel({ catalog, activeTab }) {
  return (
    <div className="admin-panel-container"> {/* <--- Added class name */}
      {activeTab === "crear" && (
        <>
          <h2 className="admin-panel-heading"> {/* <--- Added class name */}
            Agregar nuevos elementos
          </h2>
          <AdminTabCategorias mode="crear" catalog={catalog} />
        </>
      )}

      {activeTab === "editar" && (
        <>
          <h2 className="admin-panel-heading"> {/* <--- Added class name */}
            Editar elementos existentes
          </h2>
          <AdminTabEditar mode="editar" catalog={catalog} />
        </>
      )}

      {activeTab === "eliminar" && (
        <>
          <h2 className="admin-panel-heading"> {/* <--- Added class name */}
            Eliminar elementos existentes
          </h2>
          <AdminTabEliminar mode="eliminar" catalog={catalog} />
        </>
      )}
    </div>
  );
}

export default AdminPanel;