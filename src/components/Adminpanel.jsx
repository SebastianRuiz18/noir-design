import React, { useState } from 'react';
import useCatalogFromFirebase from '../hooks/useCatalogFromFirebase';
import AdminTabCategorias from './admin/AdminTabCategorias';
import AdminTabEditar from './admin/AdminTabEditar';
import AdminTabEliminar from './admin/AdminTabEliminar';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Button, Typography, Box, Tabs, Tab, Paper } from '@mui/material'; // Import Paper for the banner
import './Adminpanel.css';

function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState(0);
  const { catalog, loading, error, refreshCatalog } = useCatalogFromFirebase();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      signOut(auth);
    }
  };

  return (
    <div className="admin-panel-container">
      {/* Reverted to a simpler banner with a subtle background */}
      <Paper 
        elevation={2}
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          mb: 3,
          backgroundColor: '#fafafa' // A neutral, light grey
        }}
      >
        <Box>
          <Typography variant="h5">Panel de Administración</Typography>
          <Typography variant="body2" color="text.secondary">Bienvenido, {user.displayName || user.email}</Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Admin Tabs" indicatorColor="primary" textColor="primary">
          <Tab label="Crear" />
          <Tab label="Editar" />
          <Tab label="Eliminar" />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {loading && <p>Cargando catálogo...</p>}
        {error && <p style={{color: 'red'}}>Error al cargar el catálogo.</p>}
        {!loading && !error && (
          <>
            {activeTab === 0 && <AdminTabCategorias catalog={catalog} onDataChange={refreshCatalog} />}
            {activeTab === 1 && <AdminTabEditar catalog={catalog} onDataChange={refreshCatalog} />}
            {activeTab === 2 && <AdminTabEliminar catalog={catalog} onDataChange={refreshCatalog} />}
          </>
        )}
      </Box>
    </div>
  );
}

export default AdminPanel;