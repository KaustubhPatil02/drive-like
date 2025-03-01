import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [folderName, setFolderName] = useState("");
  
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

  const fetchImages = async () => {
    const { data } = await axios.get("http://localhost:5000/api/images", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    setImages(data);
  };

  const handleCreateFolder = async () => {
    await axios.post("http://localhost:5000/api/folders", { name: folderName }, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    fetchFolders();
  };

  // ...existing code for useEffect, fetchFolders, fetchImages, handleCreateFolder...

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

        {/* Folders Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 ">Your Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer">
            {folders.map(folder => (
              <div
                key={folder._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
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
    </div>
  );
};

export default Dashboard;