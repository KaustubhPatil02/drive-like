import React from 'react';

const FileUploadModal = ({
  showUploadModal,
  setShowUploadModal,
  selectedFile,
  setSelectedFile,
  imageName,
  setImageName,
  uploadProgress,
  handleImageUpload,
  handleFileSelect,
  setUploadProgress,
}) => {
  if (!showUploadModal) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-  z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md border-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload File</h3>
          <button
            onClick={() => {
              setShowUploadModal(false);
              setSelectedFile(null);
              setImageName('');
              setUploadProgress(0);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label htmlFor="imageName" className="block text-sm font-medium text-gray-700 mb-1">
              File Name
            </label>
            <input
              id="imageName"
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter file name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
              Choose File
            </label>
            <input
              id="imageFile"
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Maximum file size: 5MB</p>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                setImageName('');
                setUploadProgress(0);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadProgress > 0 && uploadProgress < 100}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;