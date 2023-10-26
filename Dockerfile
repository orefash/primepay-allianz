# Stage 1: Build the TypeScript Application
FROM --platform=linux/amd64 node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Create a production-ready image
FROM --platform=linux/amd64 node:16-alpine

# Set environment variables (if needed)
# ENV NODE_ENV=production

# Create a directory for the application
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app/lib ./lib
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port your application will run on (if needed)
# EXPOSE 3000

# Define the command to start your application
CMD [ "node", "./lib/index.js" ]
