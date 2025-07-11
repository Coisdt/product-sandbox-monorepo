# TanStack Start + Express Monorepo Setup

## 1. Create Nx workspace

# Run this from the parent directory where you want your new monorepo

# This creates a new directory with the name you specify (e.g., "my-monorepo")

npx create-nx-workspace@latest my-monorepo --preset=empty

# Then navigate into the new workspace

cd my-monorepo

## 2. Install required Nx plugins

npm install --save-dev @nx/node @nx/express

## 3. Generate Express API

npx nx g @nx/express:app api --directory=apps/api

## 4. Create TanStack Start frontend

cd apps
npx create-tanstack-start@latest frontend

## 5. Integrate TanStack Start with Nx

# Create apps/frontend/project.json for Nx task management

# Add build, serve, and lint targets that delegate to TanStack Start commands

## 6. Configure workspace dependencies

# Update root package.json to include frontend workspace

# Configure shared TypeScript configs and interfaces between apps

## 7. Optional: Add shared libraries

# npx nx g @nx/js:lib shared --directory=libs/shared

# Move common interfaces and utilities to shared lib

## Benefits of this approach:

# - TanStack Start provides full-stack React with file-based routing

# - Express API handles backend logic and database operations

# - Nx manages the monorepo and task orchestration

# - Shared code between frontend and backend through libs
