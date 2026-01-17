# ========================================
# DOCKERFILE - Building our app container
# ========================================

# STEP 1: Start with Node.js base image
FROM node:18-alpine

# Why node:18-alpine?
# - node:18 = Has Node.js version 18 installed
# - alpine = Super small Linux (only 5MB vs 200MB)
# Result: Faster downloads, smaller images!

# STEP 2: Set working directory inside container
WORKDIR /app

# Now all commands run inside /app folder
# Like saying "cd /app" automatically

# STEP 3: Copy package files first
COPY app/package*.json ./

# Why copy package.json first?
# Docker caches each step (called "layers")
# If package.json doesn't change, Docker reuses cached npm install
# This makes rebuilds MUCH faster!

# STEP 4: Install dependencies
RUN npm install

# This downloads express, pg, body-parser
# Happens inside the container, not your PC!

# STEP 5: Copy application code
COPY app/ .

# Copies everything from app/ folder into container
# Now container has server.js and public/index.html

# STEP 6: Expose port 3000
EXPOSE 3000

# This is documentation - tells users "this app uses port 3000"
# Doesn't actually open the port (docker run -p does that)

# STEP 7: Start the application
CMD ["npm", "start"]

# When container starts, run "npm start"
# Which runs "node server.js" (from package.json)
