# Firebase Setup for Save Shop Feature

This guide explains how to configure Firebase to support the "Save Shop" functionality in your Dungeon & Shopkeep application.

## Required Firebase Services

Your app uses the following Firebase services:

1. **Firebase Authentication** - For user sign-in with Google
2. **Cloud Firestore** - For storing saved shop data
3. **Firebase Hosting** (optional) - For web app deployment

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "dungeon-shopkeep")
4. Enable/disable Google Analytics as desired
5. Click "Create project"

## Step 2: Enable Authentication

### Enable Google Sign-In Provider:

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable** to ON
4. **Set Project Support Email** (required)
5. **Add Authorized Domains** for production:
   - Add your deployment domain (e.g., `your-app.azurecontainerapps.io`)
   - `localhost` should already be there for development
6. Click **Save**

### Configure OAuth Consent Screen (if needed):

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen with your app details

## Step 3: Set Up Cloud Firestore

### Create Firestore Database:

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in production mode**
4. Select a location (choose closest to your users, e.g., `us-central` for US)
5. Click **Done**

### Configure Security Rules:

Replace the default Firestore rules with these security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own shops
    match /shops/{shopId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.creatorId;
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.creatorId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
\`\`\`

**Important:** These rules ensure that:
- Only authenticated users can create shops
- Users can only access shops they created
- All other access is denied

### Test Security Rules:

1. Go to **Firestore Database** → **Rules** tab
2. Click **Rules playground**
3. Test with:
   - **Operation**: `get`
   - **Path**: `/shops/c79Q8Es9rPmyk22x2e72`
   - **Authentication**: Simulate a user
   - **Request data**: Include `creatorId` matching the simulated user

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** → **Web** (</> icon)
4. Register your app with a nickname (e.g., "Dungeon Shopkeep Web")
5. Copy the configuration values:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // ← Copy this
  authDomain: "your-project.firebaseapp.com",  // ← Copy this
  projectId: "your-project-id",                // ← Copy this
  storageBucket: "your-project.appspot.com",   // ← Copy this
  messagingSenderId: "123456789012",           // ← Copy this
  appId: "1:123456789012:web:abcdef123456"     // ← Copy this
};
\`\`\`

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root with the Firebase configuration:

\`\`\`bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
\`\`\`

**Note:** Replace the values with your actual Firebase configuration.

## Step 6: Test the Save Feature

1. **Start your development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Test the authentication flow**:
   - Click "Sign In" button
   - Complete Google sign-in
   - Verify you see "Sign Out" and user info

3. **Test saving a shop**:
   - Create a shop with items
   - Click "Save Shop" button
   - Check for success message

4. **Verify data in Firestore**:
   - Go to Firebase Console → Firestore Database
   - Look for a `shops` collection
   - Check that documents contain the expected shop data

## Data Structure

The app stores shop data in Firestore with this structure:

\`\`\`typescript
// Collection: shops
// Document ID: auto-generated
{
  title: "Mystic Emporium",
  owner: "Eldrin the Merchant", 
  items: [
    {
      id: "1",
      name: "Steel Longsword",
      category: "Weapon",
      price: 15,
      currency: "GP"
    }
    // ... more items
  ],
  theme: "parchment",
  creatorId: "kiSHBz9jbyTJveHZAicDvMIzZl52",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
\`\`\`

## Production Considerations

### Update Security Rules for Production:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shops/{shopId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.creatorId &&
                          validateShopData(request.resource.data);
    }
  }
  
  function validateShopData(data) {
    return data.keys().hasAll(['title', 'owner', 'items', 'theme', 'creatorId']) &&
           data.title is string &&
           data.owner is string &&
           data.items is list &&
           data.theme is string &&
           data.creatorId is string;
  }
}
\`\`\`

### Monitor Usage:

1. **Authentication** → Monitor sign-in methods and user activity
2. **Firestore** → Monitor read/write operations and storage usage
3. **Usage and billing** → Monitor costs (Firestore has generous free tier)

## Troubleshooting

### Common Issues:

1. **"Firebase is not configured" error**:
   - Verify all environment variables are set correctly
   - Check for typos in variable names
   - Restart your development server

2. **Authentication popup blocked**:
   - Allow popups for your domain
   - Check browser settings

3. **Permission denied errors**:
   - Verify Firestore security rules
   - Check that user is authenticated
   - Ensure `creatorId` matches authenticated user

4. **CORS errors in production**:
   - Add your production domain to Firebase authorized domains
   - Update OAuth settings in Google Cloud Console

### Testing Commands:

\`\`\`bash
# Check if Firebase config is loaded
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

# Test Firebase initialization in browser console
console.log(firebase.apps.length > 0 ? 'Firebase initialized' : 'Firebase not initialized')
\`\`\`

## Security Best Practices

1. **Never commit** `.env.local` file to git
2. **Use environment-specific** Firebase projects (dev/staging/prod)
3. **Regularly review** Firestore security rules
4. **Monitor** authentication and database usage
5. **Set up billing alerts** to avoid unexpected charges
6. **Enable App Check** for additional security (optional)

## GitHub Actions Integration

For automated deployment, add your Firebase configuration as GitHub Secrets:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

The GitHub Actions workflow will automatically use these secrets during deployment.
