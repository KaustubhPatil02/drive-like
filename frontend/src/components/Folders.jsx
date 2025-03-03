import React from 'react';

const Folders = ({ folders, currentFolder, handleFolderClick }) => {
  return (
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
  );
};

export default Folders;