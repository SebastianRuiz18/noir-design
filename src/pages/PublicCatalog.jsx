// src/pages/PublicCatalog.jsx
import Navbar from "../components/Navbar";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import { useState } from "react";
import DynamicProductGrid from "../components/DynamicProductGrid";

function PublicCatalog() {
  const catalog = useCatalogFromFirebase();
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-6">Catálogo</h2>
        {catalog.map(category => (
          <div key={category.id} className="mb-4">
            <h3 className="text-gray-700 font-medium mb-2">{category.name}</h3>
            <ul className="pl-4 space-y-1">
              {category.subcategories?.map(sub => (
                <li
                  key={sub.id}
                  className="text-blue-600 hover:underline cursor-pointer text-sm"
                  onClick={() => setSelectedSubcategory(sub)}
                >
                  {sub.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <main className="flex-1 p-6">
        {selectedSubcategory ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedSubcategory.name}
            </h1>
            <DynamicProductGrid
              subcategoryId={selectedSubcategory.id}
              isAdmin={false}
            />
          </>
        ) : (
          <p className="text-gray-500 text-lg">Selecciona una subcategoríaaaa</p>
        )}
      </main>
    </div>
  );
}

export default PublicCatalog;
