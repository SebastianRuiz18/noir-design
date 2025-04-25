import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function TestFirebase() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        snapshot.forEach(doc => {
          console.log(doc.id, doc.data());
        });
      } catch (error) {
        console.error("Error al conectar con Firestore:", error);
      }
    };

    fetchData();
  }, []);

  return <p style={{ padding: "1rem" }}>Revisa la consola para ver si Firestore está conectado 👀</p>;
}

export default TestFirebase;