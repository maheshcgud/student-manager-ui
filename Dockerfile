# Stage 1: Build React App using Vite
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React UI using Vite
RUN npm run build

# Stage 2: Serve React App using Nginx
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for serving the React app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
