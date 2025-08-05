# Azure Container Apps Deployment Guide

This guide will help you deploy your Next.js application to Azure Container Apps.

## Prerequisites

1. **Azure CLI**: Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
2. **Azure Subscription**: You need an active Azure subscription
3. **Docker** (optional): For local testing

## Quick Deployment

### Option 1: Using the PowerShell Script (Recommended)

1. **Login to Azure**:
   \`\`\`powershell
   az login
   \`\`\`

2. **Run the deployment script**:
   \`\`\`powershell
   .\deploy-to-azure.ps1 -ResourceGroupName "dungeon-shopkeep-rg" -ContainerAppName "dungeon-shopkeep-app" -ContainerRegistryName "dungeonshopkeepreg" -Location "eastus"
   \`\`\`

   Replace the parameter values with your preferred names.

### Option 2: Manual Deployment

1. **Install Container Apps extension**:
   \`\`\`bash
   az extension add --name containerapp --upgrade
   \`\`\`

2. **Create a resource group**:
   \`\`\`bash
   az group create --name dungeon-shopkeep-rg --location eastus
   \`\`\`

3. **Create Azure Container Registry**:
   \`\`\`bash
   az acr create --resource-group dungeon-shopkeep-rg --name dungeonshopkeepreg --sku Basic --admin-enabled true
   \`\`\`

4. **Build and push your image**:
   \`\`\`bash
   az acr build --registry dungeonshopkeepreg --image dungeon-shopkeep:latest .
   \`\`\`

5. **Create Container Apps environment**:
   \`\`\`bash
   az containerapp env create --name dungeon-shopkeep-env --resource-group dungeon-shopkeep-rg --location eastus
   \`\`\`

6. **Deploy the Container App**:
   \`\`\`bash
   az containerapp create \
     --name dungeon-shopkeep-app \
     --resource-group dungeon-shopkeep-rg \
     --environment dungeon-shopkeep-env \
     --image dungeonshopkeepreg.azurecr.io/dungeon-shopkeep:latest \
     --target-port 3000 \
     --ingress 'external' \
     --registry-server dungeonshopkeepreg.azurecr.io \
     --cpu 0.5 --memory 1.0Gi \
     --min-replicas 1 --max-replicas 3
   \`\`\`

## Environment Variables

If your app uses environment variables (like Firebase config), add them during container app creation:

\`\`\`bash
az containerapp create \
  # ... other parameters ... \
  --env-vars "NODE_ENV=production" "NEXT_PUBLIC_FIREBASE_API_KEY=your-key"
\`\`\`

## Updating Your App

To update your deployed app with new changes:

1. **Build and push new image**:
   \`\`\`bash
   az acr build --registry dungeonshopkeepreg --image dungeon-shopkeep:latest .
   \`\`\`

2. **Update the container app**:
   \`\`\`bash
   az containerapp update --name dungeon-shopkeep-app --resource-group dungeon-shopkeep-rg
   \`\`\`

## Custom Domain (Optional)

To add a custom domain:

1. **Add the domain**:
   \`\`\`bash
   az containerapp hostname add --hostname www.yourdomain.com --name dungeon-shopkeep-app --resource-group dungeon-shopkeep-rg
   \`\`\`

2. **Bind SSL certificate** (if you have one):
   \`\`\`bash
   az containerapp ssl upload --certificate-file path/to/cert.pfx --name dungeon-shopkeep-app --resource-group dungeon-shopkeep-rg
   \`\`\`

## Monitoring and Logs

- **View logs**: `az containerapp logs show --name dungeon-shopkeep-app --resource-group dungeon-shopkeep-rg`
- **Monitor in Azure Portal**: Navigate to your Container App in the Azure Portal for detailed monitoring

## Cost Optimization

- Container Apps scale to zero when not in use
- You only pay for the compute resources you use
- Consider using Azure Container Apps consumption plan for development/testing

## Troubleshooting

- **Build failures**: Check Dockerfile and ensure all dependencies are properly specified
- **App not starting**: Check container logs for startup errors
- **502 errors**: Verify the target port (3000) matches your app's listening port
