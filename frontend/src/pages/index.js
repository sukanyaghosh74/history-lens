import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ImageGallery from '../components/ImageGallery';
import EditModal from '../components/EditModal';
import VideoPreview from '../components/VideoPreview';
import styles from '../styles/layout.css';

export default function Home() {
  const [images, setImages] = useState([]); // [{url, era, edited:bool}]
  const [original, setOriginal] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file) => {
    setLoading(true);
    setError('');
    try {
      // POST to backend /api/generate
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOriginal(data.original);
      setImages(data.variants);
    } catch (e) {
      setError(e.message || 'Failed to generate variants.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (img) => {
    setEditTarget(img);
    setShowEdit(true);
  };

  const handleEditComplete = (editedImg) => {
    setImages((imgs) => imgs.map((img) => img.url === editTarget.url ? editedImg : img));
    setShowEdit(false);
    setEditTarget(null);
  };

  const handleVideoCompose = async (selectedImages, caption) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: selectedImages, caption })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (e) {
      setError(e.message || 'Failed to compose video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <header className="hero">
        <h1>HistoryLens — Time Travel with Your Photos</h1>
        <p>Transform your photos into different eras and create narrated timelines.</p>
      </header>
      <UploadForm onUpload={handleUpload} loading={loading} />
      <button className="sample-btn" onClick={() => handleUpload(null)}>Try sample images</button>
      {error && <div className="error-msg">{error}</div>}
      <ImageGallery images={images} original={original} onEdit={handleEdit} />
      {showEdit && <EditModal image={editTarget} onClose={() => setShowEdit(false)} onComplete={handleEditComplete} />}
      <VideoPreview videoUrl={videoUrl} />
      {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
    </div>
  );
}
