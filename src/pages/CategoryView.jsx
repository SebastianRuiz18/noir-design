import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCatalogFromFirebase from '../hooks/useCatalogFromFirebase';
import DynamicProductGrid from '../components/DynamicProductGrid';
import { Box, Typography, CircularProgress, Alert, Paper, Grid } from '@mui/material';

function CategoryView() {
  const { categoryId, subcategoryId } = useParams();
  const { catalog, loading, error } = useCatalogFromFirebase();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error al cargar el catálogo de productos.</Alert>;
  }

  const category = catalog.find(cat => cat.id === categoryId);

  if (!category) {
    return <Alert severity="warning">La categoría solicitada no fue encontrada.</Alert>;
  }

  return (
    <div>
      <Navbar catalog={catalog} />
      <Box sx={{ pt: 4, pb: 4, px: { xs: 2, sm: 4 } }}>
        {subcategoryId ? (
          <DynamicProductGrid subcategoryId={subcategoryId} catalog={catalog} />
        ) : (
          <Box>
            <Typography variant="h3" component="h1" gutterBottom align="center">
              {category.name}
            </Typography>
            <Typography variant="h6" component="p" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Selecciona una subcategoría para ver los productos.
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {(category.subcategories || []).map(sub => (
                <Grid item key={sub.id}>
                  <Paper elevation={3} sx={{ '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
                    <Link to={`/category/${categoryId}/${sub.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h5">{sub.name}</Typography>
                      </Box>
                    </Link>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <Footer />
    </div>
  );
}

export default CategoryView;