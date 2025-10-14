# Setup Guide for Drive-Like

This guide will help you set up the Drive-Like application on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v14.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - (Optional) Install yarn: `npm install -g yarn`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### MongoDB Options

Choose one of the following:

#### Option 1: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier is sufficient)
4. Click "Connect" and get your connection string
5. Replace `<password>` with your database user password

#### Option 2: Local MongoDB Installation
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default connection string: `mongodb://localhost:27017/drive-like`

## MongoDB Setup

### For MongoDB Atlas:
1. Create a new cluster
2. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Grant "Read and Write" permissions

3. Whitelist your IP:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)

4. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### For Local MongoDB:
1. Start MongoDB service:
   - **Windows**: MongoDB should start automatically
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

2. Verify MongoDB is running:
   ```bash
   mongosh
   ```

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Edit `.env` file with your settings:
   ```env
   # Your MongoDB connection string
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/drive-like?retryWrites=true&w=majority
   
   # Generate a secure random string for JWT (at least 32 characters)
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   
   # Server port
   PORT=5000
   
   # Environment
   NODE_ENV=development
   ```

5. **Generate a secure JWT secret** (optional but recommended)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as your `JWT_SECRET`

6. **Test backend**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   ✅ MongoDB Connected!
   ✅ Backend server is running on port 5000!
   ```

## Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Edit `.env` file:
   ```env
   # For local development
   VITE_API_URL=http://localhost:5000
   
   # For production (uncomment and use your deployed backend URL)
   # VITE_API_URL=https://your-backend.vercel.app
   ```

5. **Test frontend**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

## Running the Application

### Development Mode

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

1. Open your browser
2. Go to `http://localhost:5173`
3. You should see the Drive-Like login page

### Test the Application

Use the provided test credentials:
- **Email**: `testuser@gmail.com`
- **Password**: `test@1234`

Or create a new account by clicking "Sign Up"

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError`
- **Solution 1**: Check your MongoDB connection string
- **Solution 2**: Ensure MongoDB service is running (for local installation)
- **Solution 3**: Check IP whitelist in MongoDB Atlas
- **Solution 4**: Verify username/password in connection string

### Backend Port Already in Use

**Error**: `Port 5000 is already in use`
- **Solution 1**: Change port in `.env` file:
  ```env
  PORT=5001
  ```
- **Solution 2**: Find and kill the process using port 5000:
  ```bash
  # macOS/Linux
  lsof -ti:5000 | xargs kill
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Frontend Can't Connect to Backend

**Error**: CORS or network errors
- **Solution 1**: Ensure backend is running on the correct port
- **Solution 2**: Verify `VITE_API_URL` in frontend `.env`
- **Solution 3**: Check browser console for specific errors
- **Solution 4**: Clear browser cache and restart dev server

### Module Not Found Errors

**Error**: `Cannot find module 'xxx'`
- **Solution**: Reinstall dependencies:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### JWT Authentication Issues

**Error**: "Invalid Token" or "Access Denied"
- **Solution 1**: Ensure JWT_SECRET is set in backend `.env`
- **Solution 2**: Clear browser localStorage and login again
- **Solution 3**: Check that the token is being sent in Authorization header

### File Upload Issues

**Error**: "Error uploading file" or "File too large"
- **Solution 1**: Check file size (max 5MB)
- **Solution 2**: Ensure file is an image format
- **Solution 3**: Check MongoDB GridFS configuration
- **Solution 4**: Verify folder is selected before upload

### Build Issues

**Error**: Build fails with TypeScript or lint errors
- **Solution**: The project uses JavaScript, not TypeScript. Check:
  ```bash
  # Frontend
  npm run lint
  npm run build
  
  # Backend
  npm start
  ```

## Production Deployment

### Deploy to Vercel

**Backend:**
```bash
cd backend
vercel
```

**Frontend:**
```bash
cd frontend
vercel
```

Update environment variables in Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add your production variables (MONGO_URI, JWT_SECRET, VITE_API_URL)

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)

## Need Help?

- Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Create an issue on GitHub for bugs or questions

---

Happy Coding! 🚀
