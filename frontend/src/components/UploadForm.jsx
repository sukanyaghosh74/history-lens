import React, { useRef } from 'react';

export default function UploadForm({ onUpload, loading }) {
  const fileInput = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only jpeg, png, or webp images allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Max file size is 10MB.');
      return;
    }
    onUpload(file);
  };

  return (
    <form className="upload-form" onSubmit={e => e.preventDefault()}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        ref={fileInput}
        onChange={handleChange}
        disabled={loading}
      />
      <button type="button" onClick={() => fileInput.current.click()} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  );
}
