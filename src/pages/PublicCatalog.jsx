// src/pages/PublicCatalog.jsx
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import { useMemo } from "react";
import DynamicProductGrid from "../components/DynamicProductGrid";

function PublicCatalog() {
  const { category, subcategory } = useParams(); // ⬅️ Lee los params de la URL
  const catalog = useCatalogFromFirebase();

  // Busca la subcategoría que coincide con la URL
  const selectedSubcategory = useMemo(() => {
    const cat = catalog.find(c => c.id === category);
    return cat?.subcategories?.find(s => s.id === subcategory) || null;
  }, [catalog, category, subcategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-6">Catálogo</h2>
        {catalog.map(cat => (
          <div key={cat.id} className="mb-4">
            <h3 className="text-gray-700 font-medium mb-2">{cat.name}</h3>
            <ul className="pl-4 space-y-1">
              {cat.subcategories?.map(sub => (
                <li
                  key={sub.id}
                  className={`cursor-pointer text-sm ${
                    sub.id === subcategory
                      ? "text-blue-800 font-semibold"
                      : "text-blue-600 hover:underline"
                  }`}
                  onClick={() => {
                    window.location.href = `/${cat.id}/${sub.id}`; // 🔄 Navega
                  }}
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
          <p className="text-gray-500 text-lg">Selecciona una subcategoría.</p>
        )}
      </main>
    </div>
  );
}

export default PublicCatalog;
