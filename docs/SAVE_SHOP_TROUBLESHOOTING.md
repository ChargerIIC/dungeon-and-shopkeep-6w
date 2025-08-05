# Save Shop Feature Troubleshooting

Quick troubleshooting guide for common issues with the Save Shop functionality.

## Common Issues & Solutions

### 1. "Please sign in to save your shop" Message

**Problem**: User sees this message even when they appear to be signed in.

**Solutions**:
- Check if Firebase Auth is properly initialized
- Verify Google sign-in provider is enabled in Firebase Console
- Check browser console for authentication errors
- Try signing out and signing in again

**Test**:
```javascript
// In browser console
console.log('Auth state:', firebase.auth().currentUser)
```

### 2. "Firebase is not configured" Error

**Problem**: Firebase configuration is missing or incorrect.

**Solutions**:
- Verify all environment variables are set in `.env.local`
- Check for typos in variable names (they're case-sensitive)
- Restart your development server after adding environment variables
- Run the config extraction script: `node extract-firebase-config.js`

**Test**:
```bash
# Check if variables are loaded
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

### 3. "Permission denied" Error When Saving

**Problem**: Firestore security rules are blocking the save operation.

**Solutions**:
- Check Firestore security rules in Firebase Console
- Ensure rules allow authenticated users to create documents
- Verify the `creatorId` field matches the authenticated user's UID

**Required Security Rule**:
```javascript
match /shops/{shopId} {
  allow create: if request.auth != null && 
                request.auth.uid == request.resource.data.creatorId;
}
```

### 4. Save Button Doesn't Respond

**Problem**: Clicking "Save Shop" button does nothing.

**Solutions**:
- Check browser console for JavaScript errors
- Verify Firebase SDK is loaded properly
- Check if shop has required fields (title, owner, items)
- Ensure user is authenticated

### 5. Saved Shops Don't Load

**Problem**: "Load Saved Shop" shows no shops even after saving.

**Solutions**:
- Check Firestore security rules allow reading user's own shops
- Verify the query filters are correct (`creatorId` equals current user)
- Check browser network tab for failed Firestore requests

**Required Security Rule**:
```javascript
match /shops/{shopId} {
  allow read: if request.auth != null && 
              request.auth.uid == resource.data.creatorId;
}
```

### 6. Authentication Popup Blocked

**Problem**: Google sign-in popup is blocked by browser.

**Solutions**:
- Allow popups for your domain in browser settings
- Try using incognito/private mode
- Check if popup blockers are enabled
- Verify domain is authorized in Firebase Auth settings

### 7. CORS Errors in Production

**Problem**: Cross-origin errors when accessing Firebase in deployed app.

**Solutions**:
- Add your production domain to Firebase authorized domains
- Update OAuth consent screen in Google Cloud Console
- Verify Firebase configuration in production environment

## Quick Diagnostic Steps

### 1. Check Firebase Configuration
```javascript
// In browser console
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
  // ... check other vars
})
```

### 2. Check Authentication State
```javascript
// In browser console
import { auth } from './lib/firebase'
console.log('Auth:', auth?.currentUser ? 'Signed in' : 'Not signed in')
```

### 3. Test Firestore Connection
```javascript
// In browser console
import { db } from './lib/firebase'
console.log('Firestore:', db ? 'Connected' : 'Not connected')
```

### 4. Check Network Requests
1. Open browser Developer Tools
2. Go to Network tab
3. Try saving a shop
4. Look for failed requests to Firebase APIs

## Environment-Specific Issues

### Development Environment
- Ensure `.env.local` file exists and has correct values
- Restart development server after changing environment variables
- Check that `localhost` is in Firebase authorized domains

### Production Environment
- Verify environment variables are set in deployment platform
- Check that production domain is in Firebase authorized domains
- Ensure Firebase configuration is passed to build process

### GitHub Actions Deployment
- Verify all Firebase secrets are set in GitHub repository settings
- Check that secrets are properly passed to build environment
- Review deployment logs for configuration errors

## Need More Help?

1. **Check the complete [Firebase Setup Guide](FIREBASE_SETUP.md)**
2. **Review [GitHub Actions Setup Guide](docs/GITHUB_ACTIONS_SETUP.md)**
3. **Check Firebase Console logs for specific error messages**
4. **Use browser Developer Tools to inspect network requests and console errors**

## Useful Firebase Console Links

- [Authentication Users](https://console.firebase.google.com/project/_/authentication/users)
- [Firestore Data](https://console.firebase.google.com/project/_/firestore/data)
- [Security Rules](https://console.firebase.google.com/project/_/firestore/rules)
- [Project Settings](https://console.firebase.google.com/project/_/settings/general)
