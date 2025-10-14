import React, { useState } from 'react';
import ImagePreview from './Image-Preview';

const Files = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Files</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleImageClick(image)}
          >
            <div className="w-full h-32 relative bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={`https://drive-like-api.vercel.app/api/images/${image.url}`}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-700 truncate">{image.name}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImagePreview image={selectedImage} onClose={handleClosePreview} />
      )}
    </div>
  );
};

export default Files;