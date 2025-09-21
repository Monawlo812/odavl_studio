# VS Code Extension Publishing Guide

## Option 1: Fix PAT and Publish via CLI

### Step 1: Create/Update Personal Access Token
1. Go to: https://dev.azure.com/[organization]/_usersSettings/tokens
2. Create new token with these scopes:
   - **Marketplace**: Manage
   - **Marketplace**: Acquire
   - **Marketplace**: Publish
3. Copy the new token

### Step 2: Use the token
```bash
npx @vscode/vsce publish -p [YOUR_NEW_TOKEN]
```

## Option 2: Manual Upload (Recommended)

### Step 1: Visit VS Code Marketplace
Go to: https://marketplace.visualstudio.com/manage/publishers/odavl

### Step 2: Upload VSIX
1. Click "New extension"
2. Upload the file: `odavl-studio-0.3.0.vsix`
3. Fill in any additional details
4. Publish

## Extension Details
- **Package Created**: ✅ odavl-studio-0.3.0.vsix (11.68 KB)
- **Files Included**: 9 files (LICENSE, package.json, readme.md, assets, dist)
- **Location**: C:\Users\sabou\odavl_studio\apps\vscode-ext\odavl-studio-0.3.0.vsix

## Current Status
✅ Extension packaged successfully
⚠️ Publishing failed due to PAT permissions
📦 Manual upload option available