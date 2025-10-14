# Drive-Like 📁

A Google Drive-like web application that allows users to manage files and folders with authentication, built with the MERN stack.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Drive-Like is a cloud storage application where users can:
- Register and authenticate securely
- Create nested folder structures (similar to Google Drive)
- Upload and manage images within folders
- Search for images by name
- Access only their own files and folders

## ✨ Features

### Implemented Features
- [x] **User Authentication**
  - Signup with email and password
  - Login with JWT-based authentication
  - Secure logout functionality
  
- [x] **Folder Management**
  - Create nested folders (Google Drive-like structure)
  - Organize files in folders
  - User-specific folder access
  
- [x] **Image Management**
  - Upload images with custom names
  - Store images using MongoDB GridFS
  - Maximum file size: 5MB
  - View uploaded images
  
- [x] **Search Functionality**
  - Search images by name
  - User-specific search results
  
- [x] **Security**
  - JWT-based authentication
  - Protected API routes
  - User-specific data access

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **GridFS** - File storage
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management
- **React Router** - Navigation

### Deployment
- **Vercel** - Hosting platform

## 🚀 Live Demo

- **Frontend**: [https://drive-like-frontend.vercel.app](https://drive-like-frontend.vercel.app)
- **Backend API**: [https://drive-like-api.vercel.app](https://drive-like-api.vercel.app)

### Test Credentials
```
Email: testuser@gmail.com
Password: test@1234
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaustubhPatil02/drive-like.git
   cd drive-like
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file from example
   cp .env.example .env
   
   # Edit .env and add your MongoDB URI and JWT secret
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   
   # Start the backend server
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file from example
   cp .env.example .env
   
   # Edit .env and add your backend URL
   # VITE_API_URL=http://localhost:5000
   
   # Start the frontend development server
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

For production, update `VITE_API_URL` to your deployed backend URL.

## 📚 Documentation

This project includes comprehensive documentation:

- **[Setup Guide](SETUP.md)** - Detailed setup instructions for local development
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference with endpoints and examples
- **[Security Guide](SECURITY.md)** - Security best practices and guidelines
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project

### Quick API Reference
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/folders` - Get user folders
- `POST /api/folders` - Create new folder
- `GET /api/images` - Get user images
- `POST /api/images` - Upload image
- `GET /api/search?q=<query>` - Search images

## 📁 Project Structure

```
drive-like/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # State management
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main app component
│   └── package.json
│
├── API_DOCUMENTATION.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Kaustubh Patil**
- GitHub: [@KaustubhPatil02](https://github.com/KaustubhPatil02)

## 🙏 Acknowledgments

- Inspired by Google Drive
- Built as a learning project for MERN stack development

---

Made with ❤️ by Kaustubh Patil