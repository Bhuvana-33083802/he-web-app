# Stage 1: Build the React app using Node.js
FROM node:14 AS build

WORKDIR /app

# Copy package.json and package-lock.json first for faster caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the React app for production
RUN npm run build


# Stage 2: Serve the built app using Nginx
FROM nginx:alpine

# Remove the default Nginx index.html and copy the React build files into Nginx's serving directory
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html/

# Expose the necessary port for the Nginx server
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
