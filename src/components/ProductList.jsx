import { useParams } from "react-router-dom";
import ProductGrid from "./ProductList";

function ProductList({ catalog }) {
  const { categoryId, subcategoryId } = useParams();

  const category = catalog.find(cat => cat.id === categoryId);
  const subcategory = category?.subcategories.find(sub => sub.id === subcategoryId);
  const products = subcategory?.products || [];

  return (
    <div style={{ paddingTop: "1rem" }}>
      <h2 style={{ padding: "0 1rem" }}>{subcategory?.name || "Subcategoría"}</h2>
      <ProductGrid products={products} />
    </div>
  );
}

export default ProductList;
