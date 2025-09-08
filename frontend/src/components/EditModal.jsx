import React, { useState } from 'react';

export default function EditModal({ image, onClose, onComplete }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: image.url, editPrompt: prompt })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onComplete(data.editedImage);
    } catch (e) {
      setError(e.message || 'Edit failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Image</h2>
        <input
          type="text"
          placeholder="Describe your edit (e.g., add Roman soldiers)"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={loading}
        />
        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handleEdit} disabled={loading || !prompt.trim()}>
            {loading ? 'Editing...' : 'Apply Edit'}
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </div>
    </div>
  );
}
