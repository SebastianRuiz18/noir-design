import { useState } from 'react';
import useCatalogFromFirebase from './hooks/useCatalogFromFirebase';
import Navbar from './components/Navbar';
import DynamicProductGrid from './components/DynamicProductGrid';

function App() {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const catalog = useCatalogFromFirebase();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar catalog={catalog} onSelectSubcategory={setSelectedSubcategory} />
      <main style={{ flex: 1 }}>
        <div style={{ padding: "1rem" }}>
          <h2>
            {selectedSubcategory ? selectedSubcategory.name : "Selecciona una subcategoría del menú"}
          </h2>
        </div>

        {selectedSubcategory && (
          <DynamicProductGrid subcategoryId={selectedSubcategory.id} isAdmin={false} />
        )}
      </main>
    </div>
  );
}

export default App;
