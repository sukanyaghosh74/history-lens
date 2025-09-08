import React from 'react';

export default function VideoPreview({ videoUrl }) {
  if (!videoUrl) return null;
  return (
    <div className="video-preview">
      <h3>Slideshow Video</h3>
      <video src={videoUrl} controls width="480" />
      <a href={videoUrl} download className="download-btn">Download Video</a>
    </div>
  );
}
