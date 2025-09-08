import React from 'react';

export default function ImageGallery({ images, original, onEdit }) {
  if (!original && (!images || images.length === 0)) return null;
  return (
    <div className="gallery-grid">
      {original && (
        <div className="gallery-card">
          <img src={original.url} alt="Original" />
          <div className="gallery-label">Original</div>
        </div>
      )}
      {images && images.map((img, idx) => (
        <div className="gallery-card" key={img.url}>
          <img src={img.url} alt={img.era || `Variant ${idx+1}`} />
          <div className="gallery-label">{img.era || `Variant ${idx+1}`}</div>
          <button className="edit-btn" onClick={() => onEdit(img)}>Edit</button>
        </div>
      ))}
    </div>
  );
}
