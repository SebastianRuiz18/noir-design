import { useParams } from "react-router-dom";
import useCatalogFromFirebase from "./hooks/useCatalogFromFirebase";
import Navbar from "./components/Navbar";
import DynamicProductGrid from "./components/DynamicProductGrid";
import Footer from "./components/Footer";
import TiktokWidget from "./components/TiktokWidget";
import { Box, CircularProgress, Alert } from '@mui/material';
import "./App.css";

function App() {
  // THE FIX: Correctly get the catalog, loading, and error states from the hook.
  const { catalog, loading, error } = useCatalogFromFirebase();
  const { categoryId, subcategoryId } = useParams();

  // Show a loading spinner while the catalog is being fetched.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message if the catalog fails to load.
  if (error) {
    return <Alert severity="error">Error: Could not load the website's catalog.</Alert>;
  }

  return (
    <div className="app-container">
      {/* Now we pass the correct catalog array to the Navbar */}
      <Navbar catalog={catalog} currentSubcategoryId={subcategoryId} />

      <div className="main-content-wrapper">
        <main className="main-content">
          {/* We also pass the correct catalog array to the product grid */}
          <DynamicProductGrid
            subcategoryId={subcategoryId}
            isAdmin={false}
            catalog={catalog}
          />
        </main>
        <TiktokWidget />
        <Footer />
      </div>
    </div>
  );
}

export default App;