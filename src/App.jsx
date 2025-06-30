// App.jsx
import { useParams } from "react-router-dom";
import useCatalogFromFirebase from "./hooks/useCatalogFromFirebase";
import Navbar from "./components/Navbar";
import DynamicProductGrid from "./components/DynamicProductGrid";
import Footer from "./components/Footer";
import TiktokWidget from "./components/Tiktokwidget";
import "./App.css";

function App() {
  const catalog = useCatalogFromFirebase();
  const { categoryId, subcategoryId } = useParams();

  return (
    <div className="app-container"> {/* This remains the main flex container */}
      <Navbar catalog={catalog} currentSubcategoryId={subcategoryId} />

      {/* This is the new wrapper for main content and footer */}
      <div className="main-content-wrapper">
        <main className="main-content">
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