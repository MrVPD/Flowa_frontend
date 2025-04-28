#!/bin/bash

# Clean up any previous build
rm -rf .next

# Install dependencies
npm install

# Build the app
npm run build

# Deploy to Vercel
vercel --prod 