# GitHub Actions Deployment Setup Guide

This guide will help you set up GitHub Actions to automatically deploy your Next.js app to Azure Container Apps with proper environment variables.

## Prerequisites

1. **Azure Account** with an active subscription
2. **GitHub Repository** with your code
3. **Firebase Project** with configuration details

## Step 1: Create Azure Service Principal

You need to create an Azure Service Principal for GitHub Actions to authenticate with Azure.

### Using Azure CLI:

\`\`\`bash
# Login to Azure
az login

# Create a service principal (replace 'your-subscription-id' with your actual subscription ID)
az ad sp create-for-rbac --name "github-actions-dungeon-shopkeep" \
  --role contributor \
  --scopes /subscriptions/your-subscription-id \
  --sdk-auth
\`\`\`

This will output JSON like:
\`\`\`json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
\`\`\`

**Save this entire JSON output** - you'll need it for the next step.

### Using Azure Portal:

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Click "New registration"
3. Name it "github-actions-dungeon-shopkeep"
4. Create a client secret under "Certificates & secrets"
5. Assign "Contributor" role to your subscription

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Azure Authentication Secret:
- **Name**: `AZURE_CREDENTIALS`
- **Value**: The entire JSON output from the service principal creation

### Firebase Configuration Secrets:
You can find these values in your Firebase project settings:

- **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Value**: Your Firebase API key (e.g., `AIzaSyC...`)

- **Name**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Value**: Your Firebase auth domain (e.g., `your-project.firebaseapp.com`)

- **Name**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Value**: Your Firebase project ID (e.g., `your-project-id`)

- **Name**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Value**: Your Firebase storage bucket (e.g., `your-project.appspot.com`)

- **Name**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: Your Firebase messaging sender ID (e.g., `123456789012`)

- **Name**: `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Value**: Your Firebase app ID (e.g., `1:123456789012:web:abcdef...`)

## Step 3: Find Your Firebase Configuration

**📋 Important**: If you haven't set up Firebase yet, follow the complete [Firebase Setup Guide](../FIREBASE_SETUP.md) first.

### Method 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on your web app or create one if needed
6. Copy the configuration values

### Method 2: From your existing .env.local file
If you already have a `.env.local` file, copy the values from there.

## Step 4: Update Workflow Configuration (Optional)

The workflow is configured with default Azure resource names. You can customize these by editing the `env` section in `.github/workflows/deploy.yml`:

\`\`\`yaml
env:
  AZURE_CONTAINER_APP_NAME: your-custom-app-name
  AZURE_RESOURCE_GROUP: your-custom-resource-group
  AZURE_CONTAINER_REGISTRY: yourcustomregistry
  AZURE_LOCATION: eastus
  AZURE_ENVIRONMENT_NAME: your-custom-environment
\`\`\`

**Important**: Azure Container Registry names must be globally unique and contain only lowercase letters and numbers.

## Step 5: Trigger Deployment

Once all secrets are configured:

1. **Push to main branch** - This will trigger the deployment automatically
2. **Manual trigger** - Go to Actions tab → Deploy to Azure Container Apps → Run workflow

## Step 6: Monitor Deployment

1. Go to your repository's Actions tab
2. Click on the running workflow
3. Monitor the progress and check for any errors

## Step 7: Access Your Deployed App

After successful deployment, the workflow will output the app URL in the logs. It will look like:
`https://your-app-name.randomstring.eastus.azurecontainerapps.io`

## Troubleshooting

### Common Issues:

1. **Azure Authentication Failed**
   - Verify `AZURE_CREDENTIALS` secret is correctly formatted JSON
   - Ensure the service principal has proper permissions

2. **Firebase Build Errors**
   - Check that all Firebase environment variables are set correctly
   - Verify the values match your Firebase project configuration

3. **Container Registry Name Conflicts**
   - Change the `AZURE_CONTAINER_REGISTRY` name to something unique
   - Use only lowercase letters and numbers

4. **Resource Already Exists Errors**
   - These are usually harmless - the workflow handles existing resources
   - Check the logs to ensure the deployment completed successfully

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use environment-specific secrets** for different deployment environments
3. **Regularly rotate** your Azure service principal credentials
4. **Review Firebase security rules** for production deployment

## Environment Variables in Production

The deployed app will have access to all the Firebase environment variables you configured as secrets. The app will automatically use these for Firebase initialization.

## Updating the Deployment

To update your app:
1. Make changes to your code
2. Commit and push to the main branch
3. GitHub Actions will automatically build and deploy the updated version

## Custom Domain (Optional)

After deployment, you can add a custom domain through the Azure Portal:
1. Go to your Container App
2. Navigate to "Custom domains"
3. Add your domain and configure DNS settings
