import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from "../store/authStore";

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    fetchFolderDetails();
    fetchFolderImages();
  }, [folderId]);

  const fetchFolderDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/folders/${folderId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setFolder(data);
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };

  const fetchFolderImages = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/images?folder=${folderId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", imageName);
    formData.append("folder", folderId);

    try {
      await axios.post("http://localhost:5000/api/images", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      fetchFolderImages();
      setSelectedFile(null);
      setImageName("");
    } catch (error) {
      alert(error.response?.data?.error || "Error uploading image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {folder?.name || 'Loading...'}
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload Image to Folder</h3>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Image name"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Upload Image
            </button>
          </form>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <img
                src={`http://localhost:5000/${image.url}`}
                alt={image.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-gray-600 truncate">{image.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderView;