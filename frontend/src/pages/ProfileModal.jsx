import React from 'react'
import useAuthStore from '../store/authStore';

const ProfileModal = () => {
    const { user, logout } = useAuthStore();
    
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setIsProfileOpen(true)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
      </button>
      <div className="flex items-center space-x-4">
        <span className="hidden md:inline text-gray-600">Welcome, {user.username}</span>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-100 font-medium px-4 py-2 rounded-md bg-red-500 hover:bg-red-200 transition-colors"
        >
          <span className="hidden md:inline">Sign out</span>
          <svg 
            className="w-5 h-5 md:hidden" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ProfileModal