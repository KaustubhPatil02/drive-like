# Changelog

All notable changes to the Drive-Like project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive project documentation
  - Setup guide (SETUP.md)
  - API documentation (API_DOCUMENTATION.md)
  - Security best practices (SECURITY.md)
  - Contributing guidelines (CONTRIBUTING.md)
- Environment variable examples (.env.example files)
- MIT License
- Enhanced README with complete project information
- Changelog to track project versions

### Changed
- Updated .gitignore to properly exclude environment files and uploads directory
- Improved README structure with better navigation and documentation links

## [1.0.0] - 2025-01-XX

### Added
- User authentication system
  - User registration with email and password
  - User login with JWT token generation
  - Secure logout functionality
  - Password hashing with bcrypt
  
- Folder management
  - Create nested folders (Google Drive-like structure)
  - User-specific folder access
  - Folder hierarchy support
  
- Image management
  - Image upload with custom names
  - GridFS storage for efficient file handling
  - Maximum file size: 5MB
  - Support for multiple image formats
  
- Search functionality
  - Search images by name
  - User-specific search results
  
- Security features
  - JWT-based authentication
  - Protected API routes
  - User-specific data access control
  - CORS configuration
  
- Frontend features
  - Responsive React UI with Tailwind CSS
  - File upload with progress indicator
  - Folder navigation
  - Image preview
  - Search interface
  - Mobile-responsive design
  
- Backend infrastructure
  - Express.js REST API
  - MongoDB with Mongoose ODM
  - GridFS for file storage
  - Authentication middleware
  
- Deployment
  - Vercel deployment configuration
  - Production-ready setup

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, GridFS, JWT, Bcrypt
- **Frontend**: React, Vite, Tailwind CSS, Axios, Zustand, React Router
- **Deployment**: Vercel

## Legend

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

---

[Unreleased]: https://github.com/KaustubhPatil02/drive-like/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/KaustubhPatil02/drive-like/releases/tag/v1.0.0
