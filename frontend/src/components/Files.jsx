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
      <h3 className="text-sm font-medium text-gray-500 mb-4">Files</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className="group relative bg-white rounded-lg border hover:shadow-md transition-all overflow-hidden"
            onClick={() => handleImageClick(image)}
          >
            <div className="w-full h-32 relative">
              <img
                src={`https://drive-like-api.vercel.app/api/images/${image.url}`}
                alt={image.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-2">
              <p className="text-sm text-gray-700 truncate">{image.name}</p>
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