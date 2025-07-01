import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function useCatalogFromFirebase() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // As shown in your screenshot, we will query the 'categories' collection.
      const categoriesRef = collection(db, "categories");
      
      // We will also order them by name for consistency.
      const q = query(categoriesRef, orderBy("name"));

      const snapshot = await getDocs(q);

      // The 'subcategories' array is already a field inside each document,
      // so we just need to map the data directly. No complex fetching is needed.
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (data.length === 0) {
        setError("The 'categories' collection is empty. Please add a category in the Admin Panel.");
      } else {
        setCatalog(data);
      }

    } catch (err) {
      console.error("Error fetching 'categories' collection:", err);
      // This error can happen if a category document is missing the 'name' field required for orderBy.
      setError("An error occurred while fetching the catalog. Ensure all categories have a 'name' field.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { catalog, loading, error, refreshCatalog: fetchCatalog };
}

export default useCatalogFromFirebase;