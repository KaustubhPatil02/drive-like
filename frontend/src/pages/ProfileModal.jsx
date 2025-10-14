import React from 'react'
import useAuthStore from '../store/authStore';

const ProfileModal = () => {
    const { user, logout } = useAuthStore();
    
  return (
    <div className="flex items-center space-x-4">
     
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-sm font-bold text-white">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
      <div className="flex items-center space-x-4">
        <span className="hidden md:inline text-gray-800 font-semibold">Welcome, {user.username}</span>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-white font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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