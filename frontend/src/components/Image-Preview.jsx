import React from 'react';

const ImagePreview = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white"
        >
          <svg className="w-10 h-10 bg-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={`https://drive-like-api.vercel.app/api/images/${image.url}`}
          alt={image.name}
          className="w-full h-min-[200px] object-contain"
        />
        <div className="p-4">
          <p className="text-lg font-medium text-gray-900">{image.name}</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;