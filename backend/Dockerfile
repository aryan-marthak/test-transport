# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your backend runs on (change if not 3000)
EXPOSE 3002

# Command to run your backend
CMD ["node", "index.js"]