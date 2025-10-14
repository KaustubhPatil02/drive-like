import React, { useState, useEffect, useRef } from 'react';

const SearchBox = ({ onFolderClick, onFileClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    const query = searchQuery.trim(); // Ensure query is defined
  
    if (!query) return; // Prevent unnecessary API calls
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }
  
      const response = await fetch(`https://drive-like-api.vercel.app/api/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Search error response:", errorData);
  
        if (errorData.error === "Invalid Token") {
          localStorage.removeItem("token");
          alert("Your session has expired. Please log in again.");
          // Redirect to login page or show login modal
        }
  
        throw new Error(errorData.message || "Search failed");
      }
  
      const data = await response.json();
      setSearchResults(data); // Store results
      setShowResults(true); // Show results
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="relative flex-1 max-w-2xl mx-4" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files and folders..."
          className="w-full px-4 py-2.5 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {isSearching ? (
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {(showResults && searchResults.length > 0) && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200">
          <div className="py-1">
            {searchResults.map((item) => (
              <button
                key={item._id}
                onClick={() => {
                  if (item.type === 'folder') {
                    onFolderClick?.(item._id);
                  } else {
                    onFileClick?.(item._id);
                  }
                  setShowResults(false);
                  setSearchQuery('');
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
              >
                {item.type === 'folder' ? (
                  <svg className="w-5 h-5 mr-3 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-3 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4 4 4-4m0 0l-4-4-4 4m4-4v12" />
                  </svg>
                )}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="absolute mt-2 w-full bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBox;