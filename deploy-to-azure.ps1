# Azure Container Apps Deployment Script
# Make sure you have Azure CLI installed and are logged in

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$ContainerAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$ContainerRegistryName,
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "eastus",
    
    [string]$EnvironmentName = "$ContainerAppName-env"
)

Write-Host "Starting Azure Container Apps deployment..." -ForegroundColor Green

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "✓ Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if logged in to Azure
try {
    az account show | Out-Null
    Write-Host "✓ Logged in to Azure" -ForegroundColor Green
} catch {
    Write-Host "✗ Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# Install Container Apps extension
Write-Host "Installing Azure Container Apps extension..." -ForegroundColor Yellow
az extension add --name containerapp --upgrade

# Create resource group if it doesn't exist
Write-Host "Creating resource group: $ResourceGroupName" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Create Azure Container Registry
Write-Host "Creating Azure Container Registry: $ContainerRegistryName" -ForegroundColor Yellow
az acr create --resource-group $ResourceGroupName --name $ContainerRegistryName --sku Basic --admin-enabled true

# Build and push Docker image
Write-Host "Building and pushing Docker image..." -ForegroundColor Yellow
az acr build --registry $ContainerRegistryName --image "dungeon-shopkeep:latest" .

# Create Container Apps environment
Write-Host "Creating Container Apps environment: $EnvironmentName" -ForegroundColor Yellow
az containerapp env create --name $EnvironmentName --resource-group $ResourceGroupName --location $Location

# Get ACR login server
$acrLoginServer = az acr show --name $ContainerRegistryName --resource-group $ResourceGroupName --query loginServer --output tsv

# Create Container App
Write-Host "Creating Container App: $ContainerAppName" -ForegroundColor Yellow
az containerapp create `
  --name $ContainerAppName `
  --resource-group $ResourceGroupName `
  --environment $EnvironmentName `
  --image "$acrLoginServer/dungeon-shopkeep:latest" `
  --target-port 3000 `
  --ingress 'external' `
  --registry-server $acrLoginServer `
  --registry-username $ContainerRegistryName `
  --registry-password $(az acr credential show --name $ContainerRegistryName --query passwords[0].value --output tsv) `
  --cpu 0.5 --memory 1.0Gi `
  --min-replicas 1 --max-replicas 3

# Get the app URL
$appUrl = az containerapp show --name $ContainerAppName --resource-group $ResourceGroupName --query properties.configuration.ingress.fqdn --output tsv

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Your app is available at: https://$appUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure any environment variables needed for your app"
Write-Host "2. Set up custom domain if needed"
Write-Host "3. Configure scaling rules based on your requirements"
