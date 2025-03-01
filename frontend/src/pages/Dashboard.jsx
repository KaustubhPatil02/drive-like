import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

const API = import.meta.env.VITE_API_URL;
const { data } = await axios.get(`${API}/api/folders`, {
  headers: { Authorization: localStorage.getItem("token") },
});


const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [folderName, setFolderName] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    fetchFolders();
    fetchImages();
  }, []);

  const fetchFolders = async () => {
    const { data } = await axios.get("http://localhost:5000/api/folders", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    setFolders(data);
  };



  const fetchImages = async (folderId = null) => {
    try {
      // const API = import.meta.env.VITE_API_URL;
      const { data } = await axios.get(`${API}/api/images`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (!Array.isArray(data)) {
        setImages([]);
        return;
      }

      // ✅ Show only images inside the current folder
      const filteredImages = folderId ? data.filter(img => img.folder === folderId) : data;
      setImages(filteredImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  const handleCreateFolder = async (e) => {  // Add event parameter
    e.preventDefault();  // Call preventDefault on the event object
    if (!folderName) return alert("Please enter a folder name!");

    try {
      await axios.post("http://localhost:5000/api/folders",
        { name: folderName },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setFolderName(""); // Clear input after successful creation
      fetchFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    }
  };


  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an image!");
    if (!imageName.trim()) return alert("Please enter an image name!");

    // Check file size (limit to 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size should not exceed 5MB");
      return;
    }

    // Check file type
    if (!selectedFile.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", imageName.trim());
    formData.append("folder", currentFolder || "root");

    try {
      const response = await axios.post(`${API}/api/images`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
        // Add timeout and show upload progress
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      if (response.data) {
        // Clear form
        setSelectedFile(null);
        setImageName("");
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';

        // Show success message
        alert("Image uploaded successfully!");

        // Refresh images
        fetchImages(currentFolder);
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      // More specific error messages
      if (error.response) {
        switch (error.response.status) {
          case 413:
            alert("File size too large. Please choose a smaller file.");
            break;
          case 415:
            alert("Unsupported file type. Please choose a valid image file.");
            break;
          case 500:
            alert("Server error. Please try again later or contact support.");
            break;
          default:
            alert(error.response.data?.message || "Failed to upload image");
        }
      } else if (error.code === 'ECONNABORTED') {
        alert("Upload timed out. Please try again.");
      } else {
        alert("Network error. Please check your connection and try again.");
      }
    }
  };

  // Add this function to validate file type and size before upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert('File size should not exceed 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    setSelectedFile(file);
  };

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    fetchImages(folderId);
  };





  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Drive System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Folder Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 ">
          <h3 className="text-lg font-semibold mb-4 ">Create New Folder</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreateFolder}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
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
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              disabled={uploadProgress > 0 && uploadProgress < 100}
            >
              {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Folders Grid */}
        {/* Folders Grid with Click Handler */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {currentFolder ? "Current Folder" : "Your Folders"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentFolder && (
              <div
                onClick={() => handleFolderClick(null)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  <span className="font-medium">Back</span>
                </div>
              </div>
            )}
            {folders
              .filter(folder => folder.parentFolder === currentFolder)
              .map(folder => (
                <div
                  key={folder._id}
                  onClick={() => handleFolderClick(folder._id)}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="font-medium">{folder.name}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Images Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(images) && images.length > 0 ? (
              images.map((image) => (
                <div key={image._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <img
                    src={`http://localhost:5000/api/images/${image.url}`}
                    // src={`http://localhost:5000/api/images/${image._id}`}

                    alt={image.name}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />

                  <p className="text-sm text-gray-600 truncate">{image.name}</p>
                </div>
              ))
            ) : (
              <p>No images found</p> // ✅ Prevents crash when images are empty
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;