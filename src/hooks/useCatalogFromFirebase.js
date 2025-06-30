import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";


function useCatalogFromFirebase() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCatalog(data);
    });

    return () => unsub();
  }, []);

  return catalog;
}

export default useCatalogFromFirebase;
