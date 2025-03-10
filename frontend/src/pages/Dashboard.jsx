import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import Files from "../components/Files";
import FileUploadModal from "../components/FileUploadModal";
import CreateFolderModal from "../components/CreateFolderModal";
import ProfileModal from "../pages/ProfileModal"
import SearchBox from "../components/SearchBox";

// const API = import.meta.env.VITE_API_URL ||'https://drive-like-api.vercel.app';
// const API = import.meta.env.VITE_API_URL || "https://drive-like.vercel.app//";


const Dashboard = () => {
  // State Management
  const { user } = useAuthStore();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [showNewOptions, setShowNewOptions] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [folderPath, setFolderPath] = useState([]);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchImages();
  }, []);

  // Update folder path when current folder changes
  useEffect(() => {
    updateFolderPath();
  }, [currentFolder, folders]);

  const updateFolderPath = () => {
    if (!currentFolder) {
      setFolderPath([]);
      return;
    }

    const path = [];
    let current = folders.find(f => f._id === currentFolder);
    while (current) {
      path.unshift(current);
      current = folders.find(f => f._id === current.parentFolder);
    }
    setFolderPath(path);
  };

  // API Handlers
  const fetchFolders = async () => {
    try {
      const { data } = await axios.get('https://drive-like-api.vercel.app/api/folders', {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setFolders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setFolders([]);
    }
  };

  const fetchImages = async (folderId = null) => {
    try {
      const { data } = await axios.get('https://drive-like-api.vercel.app/api/images', {
        headers: { Authorization: localStorage.getItem("token") },
      });
      // console.log(images); // Make sure all uploaded images exist in this array


      if (!Array.isArray(data)) {
        setImages([]);
        return;
      }

      const filteredImages = folderId ? data.filter(img => img.folder === folderId) : data;
      setImages(filteredImages);
    } catch (error) {
      // console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  // Event Handlers
  const handleCreateFolder = async (name) => {
    if (!name || !name.trim()) return;

    try {
      await axios.post('https://drive-like-api.vercel.app/api/folders',
        {
          name: name.trim(),
          parentFolder: currentFolder
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      fetchFolders();
      setShowNewOptions(false);
    } catch (error) {
      // console.error("Error creating folder:", error);
      alert(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size should not exceed 5MB');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setImageName(file.name.split('.')[0]); // Set default name from file
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select an image!");
    if (!imageName.trim()) return alert("Please enter an image name!");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", imageName.trim());
    formData.append("folder", currentFolder || "root");

    try {
      await axios.post('https://drive-like-api.vercel.app/api/images', formData, {
        headers: {
          Authorization: localStorage.getItem("token")
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setSelectedFile(null);
      setImageName("");
      setUploadProgress(0);
      setShowUploadModal(false);
      fetchImages(currentFolder);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadProgress(0);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    fetchImages(folderId);
  };

  const handleBreadcrumbClick = (folderId = null) => {
    setCurrentFolder(folderId);
    fetchImages(folderId);
  };


  // Render Component
  return (
    <div className="min-h-screen bg-white pt-[64px]"> {/* Added pt-[64px] for navbar height */}
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text2xl  text-blue-600 font-bold sm:text-l">Drive-Clone</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBox
              onFolderClick={handleFolderClick}
            />
            <ProfileModal />

          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 border-2"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Content */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h1 className="text2xl  text-blue-600 font-bold sm:text-l">Drive-Clone</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* New Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNewOptions(!showNewOptions)}
                  className="flex items-center justify-between w-full px-6 py-3 bg-white rounded-full shadow hover:shadow-md border border-gray-200 transition-all"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-gray-700 font-medium">New</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* New Options Dropdown */}
                {showNewOptions && (
                  <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowCreateFolderModal(true);
                          setShowNewOptions(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">New Folder</span>
                          <span className="text-xs text-gray-500">Create a new folder</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowUploadModal(true);
                          setShowNewOptions(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Upload File</span>
                          <span className="text-xs text-gray-500">Upload a file from your computer</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* My Drive Button */}
              <button
                onClick={() => {
                  handleBreadcrumbClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg ${!currentFolder ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>My Drive</span>
              </button>

              {/* Current Path */}
              {folderPath.length > 0 && (
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {folderPath.map((folder, index) => (
                      <span key={folder._id}>
                        {index > 0 && " / "}
                        {folder.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-70 border-r bg-white p-4 space-y-4">
          <div className="relative">
            {/* Main New Button */}
            <button
              onClick={() => setShowNewOptions(!showNewOptions)}
              className="flex items-center space-x-2 px-6 py-2 bg-white rounded-full shadow hover:shadow-md border border-gray-200 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-gray-700 font-medium">New</span>
              <svg className="w-4 h-4 text-gray-600 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showNewOptions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNewOptions(false)}
                />
                <div className="absolute left-0 mt-1 w-60 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 py-1">
                  {/* New Folder Option */}
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 group"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900">New Folder</span>
                        <span className="text-xs text-gray-500">Create a new folder</span>
                      </div>
                    </div>
                  </button>


                  {/* File Upload Option */}
                  <button
                    onClick={() => {
                      setShowUploadModal(true);
                      setShowNewOptions(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 group"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-900">Upload File</span>
                        <span className="text-xs text-gray-500">Upload a file</span>
                      </div>
                    </div>
                  </button>

                  {/* Optional: File Drop Zone Indicator */}
                  <div className="px-4 py-2 text-xs text-gray-500 border-t mt-1 text-center">
                    You can also drag files here
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleBreadcrumbClick()}
              className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg ${!currentFolder ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>My Drive</span>
            </button>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <button
              onClick={() => handleBreadcrumbClick()}
              className="text-gray-600 hover:text-gray-900"
            >
              My Drive
            </button>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder._id}>
                <span className="text-gray-400">/</span>
                <button
                  onClick={() => handleBreadcrumbClick(folder._id)}
                  className={`${index === folderPath.length - 1
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Folders Grid */}
          {folders.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Folders</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders
                  .filter(folder => folder.parentFolder === currentFolder)
                  .map(folder => (
                    <div
                      key={folder._id}
                      onClick={() => handleFolderClick(folder._id)}
                      className="group relative bg-white p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span className="mt-2 text-sm text-gray-700 truncate max-w-full">
                          {folder.name}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div className="cursor-pointer">
         <Files images={images} />
         </div>
          <CreateFolderModal
            showCreateFolderModal={showCreateFolderModal}
            setShowCreateFolderModal={setShowCreateFolderModal}
            handleCreateFolder={handleCreateFolder}
          />


          {/* Empty State */}
          {folders.length === 0 && images.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new file.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <FileUploadModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        imageName={imageName}
        setImageName={setImageName}
        uploadProgress={uploadProgress}
        handleImageUpload={handleImageUpload}
        handleFileSelect={handleFileSelect}
        setUploadProgress={setUploadProgress}
      />
    </div>
  );
};

export default Dashboard;