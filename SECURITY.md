# Security Best Practices

This document outlines security considerations and best practices for the Drive-Like application.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [File Upload Security](#file-upload-security)
6. [Frontend Security](#frontend-security)
7. [Deployment Security](#deployment-security)

## Environment Variables

### ✅ DO
- **Never commit `.env` files to Git**
  - They are already in `.gitignore`
  - Use `.env.example` as a template
  
- **Use strong JWT secrets**
  ```bash
  # Generate a secure random secret
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  
- **Rotate secrets periodically**
  - Change JWT_SECRET every 3-6 months
  - Update all user sessions after rotation

- **Use different secrets for each environment**
  - Development: One set of credentials
  - Production: Different, more secure credentials

### ❌ DON'T
- Don't hardcode credentials in source code
- Don't share `.env` files via email or chat
- Don't use simple or predictable secrets (e.g., "secret123")
- Don't commit API keys or database credentials

## Authentication & Authorization

### Current Implementation
The application uses JWT (JSON Web Tokens) for authentication:

1. **User Registration**
   - Passwords are hashed using bcrypt with salt rounds
   - Email uniqueness is enforced

2. **User Login**
   - Credentials are verified against hashed passwords
   - JWT token is issued upon successful authentication
   - Token expires after 1 day

3. **Protected Routes**
   - All API routes (except login/register) require authentication
   - Token is verified via middleware
   - User context is extracted from token

### Security Enhancements to Consider

#### Password Policy
```javascript
// Recommended: Add password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Xa-z\d@$!%*?&]{8,}$/;
// Minimum 8 characters, at least one uppercase, lowercase, number, and special character
```

#### Rate Limiting
```javascript
// Recommended: Add rate limiting to prevent brute force attacks
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', loginLimiter);
```

#### Token Refresh
```javascript
// Recommended: Implement refresh tokens
// Issue short-lived access tokens (15 min)
// Use long-lived refresh tokens (7 days)
```

#### Session Management
- Implement logout on server-side (token blacklist)
- Track active sessions per user
- Allow users to view/revoke active sessions

## Data Protection

### User Data Isolation
✅ **Current Implementation:**
- Users can only access their own folders and images
- Database queries filter by `user` field
- Authentication middleware validates user identity

### MongoDB Security
✅ **Implemented:**
- Using MongoDB connection with authentication
- Parameterized queries prevent injection

🔒 **Additional Recommendations:**
1. **Enable MongoDB Authentication**
   ```javascript
   // Ensure your MongoDB URI includes credentials
   mongodb+srv://username:password@cluster.mongodb.net/
   ```

2. **Use Read/Write Permissions**
   - Grant minimal required permissions to database users
   - Separate read-only and write users if needed

3. **Enable Audit Logging**
   - Track database access and modifications
   - Monitor suspicious activities

### Data Encryption
🔒 **Recommendations:**
1. **Encrypt Sensitive Data at Rest**
   - Use MongoDB encryption features
   - Encrypt sensitive user data fields

2. **Use HTTPS in Production**
   - All production traffic should use TLS/SSL
   - Vercel provides HTTPS by default

## API Security

### CORS Configuration
✅ **Current Implementation:**
```javascript
const allowedOrigins = [
  'https://drive-like-frontend.vercel.app',
  'http://localhost:5173'
];
```

🔒 **Best Practices:**
- Limit origins to trusted domains only
- Don't use wildcards (`*`) in production
- Update allowed origins when deploying new environments

### Input Validation
🔒 **Recommendations:**
1. **Validate All Inputs**
   ```javascript
   const { body, validationResult } = require('express-validator');
   
   router.post('/api/folders',
     body('name').trim().isLength({ min: 1, max: 100 }),
     body('parentFolder').optional().isMongoId(),
     (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       // Process request
     }
   );
   ```

2. **Sanitize User Inputs**
   - Remove HTML/script tags
   - Escape special characters
   - Validate file names and paths

### Error Handling
✅ **Current Implementation:**
- Generic error messages to users
- Detailed errors logged to console

🔒 **Improvements:**
- Don't expose stack traces in production
- Use proper logging service (e.g., Winston, Morgan)
- Implement error tracking (e.g., Sentry)

```javascript
// Recommended error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

## File Upload Security

### Current Implementation
✅ **Implemented:**
- File size limit (5MB)
- File type restriction (images only)
- GridFS storage

### Security Enhancements

#### 1. File Type Validation
```javascript
// Validate MIME type and file extension
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};
```

#### 2. File Name Sanitization
```javascript
// Sanitize file names to prevent path traversal
const sanitizeFileName = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};
```

#### 3. Virus Scanning
🔒 **Recommended:**
- Integrate virus scanning for uploaded files
- Use services like ClamAV or cloud-based scanners

#### 4. Content Validation
```javascript
// Verify file content matches declared type
const fileType = require('file-type');

const buffer = req.file.buffer;
const type = await fileType.fromBuffer(buffer);
// Verify type.mime matches expected image types
```

## Frontend Security

### Token Storage
✅ **Current Implementation:**
- JWT stored in Zustand state management
- Token persists in memory

🔒 **Considerations:**
- **LocalStorage**: Vulnerable to XSS attacks
- **SessionStorage**: Cleared when tab closes
- **Memory Only**: Lost on page refresh
- **HttpOnly Cookies**: Most secure (requires backend changes)

### XSS Prevention
🔒 **Best Practices:**
1. React automatically escapes content
2. Avoid using `dangerouslySetInnerHTML`
3. Sanitize any HTML content from users
4. Use Content Security Policy headers

### CSRF Protection
🔒 **Recommendations:**
- Implement CSRF tokens for state-changing operations
- Use SameSite cookie attribute
- Verify Origin/Referer headers

### Client-Side Validation
✅ **Current Implementation:**
- Required fields validation
- File type validation

⚠️ **Remember:**
- Client-side validation is for UX only
- Always validate on server-side too
- Never trust client input

## Deployment Security

### Vercel Deployment

✅ **Default Security Features:**
- Automatic HTTPS/TLS
- DDoS protection
- CDN with edge caching

🔒 **Additional Steps:**

1. **Environment Variables**
   - Set in Vercel dashboard, not in code
   - Use different values for preview/production

2. **Security Headers**
   ```javascript
   // Add to vercel.json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           },
           {
             "key": "Strict-Transport-Security",
             "value": "max-age=31536000; includeSubDomains"
           }
         ]
       }
     ]
   }
   ```

3. **Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking
   - Monitor for unusual activity

### Database Security

1. **Network Security**
   - Use MongoDB Atlas with IP whitelisting
   - Enable VPC peering for production
   - Use private connections when possible

2. **Backup & Recovery**
   - Enable automated backups
   - Test recovery procedures
   - Store backups securely

3. **Access Control**
   - Use separate database users for different environments
   - Grant minimal required permissions
   - Regularly audit database access logs

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set correctly
- [ ] JWT secret is strong and unique
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] File upload security is configured
- [ ] Error messages don't expose sensitive information
- [ ] Security headers are set
- [ ] Database credentials are secure
- [ ] MongoDB authentication is enabled
- [ ] IP whitelisting is configured
- [ ] Monitoring and logging are set up
- [ ] Regular security updates are planned

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email the maintainer directly (see repository contacts)
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be fixed before public disclosure

## Regular Security Practices

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Review Security Advisories**
   - Monitor GitHub security alerts
   - Subscribe to security mailing lists

3. **Regular Security Audits**
   - Review code for security issues
   - Test authentication flows
   - Check for common vulnerabilities (OWASP Top 10)

4. **User Education**
   - Encourage strong passwords
   - Warn about phishing attempts
   - Provide security best practices guide

---

Security is an ongoing process. Stay informed about new threats and best practices!
