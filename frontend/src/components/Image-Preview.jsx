import React from 'react';

const ImagePreview = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4">
          <img
            src={`https://drive-like-api.vercel.app/api/images/${image.url}`}
            alt={image.name}
            className="w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        <div className="p-6 bg-white border-t border-gray-200">
          <p className="text-xl font-bold text-gray-900">{image.name}</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;