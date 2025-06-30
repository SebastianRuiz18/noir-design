// src/components/TiktokGrid.jsx
import "./TiktokGrid.css";

const tiktoks = [
  {
    url: "https://www.tiktok.com/@noirdesignmx/video/7496904992801033490?lang=es-419",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZk3_A7MIgt8IOOZwagTF1NrxzX8uiPkO_g&s",
  },
  {
    url: "https://www.tiktok.com/@noirdesign/video/1234567891",
    thumbnail: "https://example.com/thumbnail2.jpg",
  },
  // ...hasta 6
];

function TiktokGrid() {
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
