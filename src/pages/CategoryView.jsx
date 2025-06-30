import { useParams } from "react-router-dom";
import DynamicProductGrid from "../components/DynamicProductGrid";
import useCatalogFromFirebase from "../hooks/useCatalogFromFirebase";
import Navbar from "../components/Navbar";

function CategoryView() {
  const { categoryId, subcategoryId } = useParams();
  const catalog = useCatalogFromFirebase();

  const selectedCategory = catalog.find((cat) => cat.id === categoryId);
  const selectedSubcategory = selectedCategory?.subcategories.find(
    (sub) => sub.id === subcategoryId
  );

  return (
    <div className="app-container">
      <Navbar catalog={catalog} />
      <main className="main-content">
        {selectedSubcategory ? (
          <>
            <h2 className="subcategory-title">{selectedSubcategory.name}</h2>
            <DynamicProductGrid subcategoryId={selectedSubcategory.id} isAdmin={false} />
          </>
        ) : (
          <p className="not-found">Subcategoría no encontrada</p>
        )}
      </main>
    </div>
  );
}

export default CategoryView;
