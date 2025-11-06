# Contributing to Drive-Like

Thank you for your interest in contributing to Drive-Like! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs
If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (browser, OS, etc.)

### Suggesting Enhancements
We welcome feature suggestions! Please create an issue with:
- A clear description of the enhancement
- The motivation behind the feature
- Any potential implementation details

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/KaustubhPatil02/drive-like.git
   cd drive-like
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all checks pass

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks in React
- Use meaningful variable and function names
- Keep components small and focused
- Use PropTypes or TypeScript for type checking (if applicable)

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Prefix commits with type:
  - `Add:` for new features
  - `Fix:` for bug fixes
  - `Update:` for updates to existing features
  - `Refactor:` for code refactoring
  - `Docs:` for documentation changes
  - `Style:` for formatting changes

## Testing
- Test your changes locally before submitting
- Ensure the application works in different browsers
- Verify both frontend and backend functionality
- Check for console errors

## Questions?
Feel free to create an issue for any questions or concerns!

## Code of Conduct
Please note that this project follows a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.
