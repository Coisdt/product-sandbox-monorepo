# 1. Create workspace
npx create-nx-workspace@latest my-monorepo --preset=empty

# 2. Install all plugins upfront
npm install --save-dev @nx/node @nx/express @nx/react @nx/vite

# 3. Generate API properly
npx nx g @nx/express:app api --directory=apps/api

# 4. Generate React frontend with Vite
npx nx g @nx/react:app frontend --directory=apps/frontend --bundler=vite

# 5. Add TanStack packages if needed
cd apps/frontend && npm install @tanstack/react-router @tanstack/react-query