import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "./TiktokGrid.css";

function TiktokGrid() {
  const [tiktoks, setTiktoks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "tiktoks"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setTiktoks(data);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching TikToks:", err);
        setError("No se pudieron cargar los videos de TikTok.");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up TikTok listener:", err);
      setError("Ocurrió un error inesperado.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="tiktok-grid">
        <h3 className="tiktok-grid-title">Últimos TikToks</h3>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tiktok-grid">
        <h3 className="tiktok-grid-title">Últimos TikToks</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="tiktok-grid">
      <h3 className="tiktok-grid-title">Últimos TikToks</h3>
      <div className="tiktok-grid-wrapper">
        {tiktoks.map((video, index) => (
          <a key={index} href={video.url} target="_blank" rel="noopener noreferrer">
            <img src={video.thumbnail} alt={`TikTok ${index + 1}`} className="tiktok-thumbnail" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default TiktokGrid;