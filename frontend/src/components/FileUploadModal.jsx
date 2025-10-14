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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upload File</h3>
          <button
            onClick={() => {
              setShowUploadModal(false);
              setSelectedFile(null);
              setImageName('');
              setUploadProgress(0);
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label htmlFor="imageName" className="block text-sm font-semibold text-gray-700 mb-2">
              File Name
            </label>
            <input
              id="imageName"
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter file name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-semibold text-gray-700 mb-2">
              Choose File
            </label>
            <input
              id="imageFile"
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-600 file:to-blue-500 file:text-white
                hover:file:from-blue-700 hover:file:to-blue-600 file:transition-all file:cursor-pointer"
              required
            />
            <p className="mt-2 text-xs text-gray-500">Maximum file size: 5MB</p>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2 text-center">{uploadProgress}% uploaded</p>
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
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadProgress > 0 && uploadProgress < 100}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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