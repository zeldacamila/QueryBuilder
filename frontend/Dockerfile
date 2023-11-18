# BUILD
# Use a Node image as the build image
FROM node:18-alpine AS BUILD_IMAGE
# Set the working directory inside the container
WORKDIR /app
# Copy the dependency files and install them
COPY package.json .
RUN npm install
# Copy the rest of the frontend source code
COPY . .

RUN npm run build


# PRODUCTION using Nginx
FROM nginx:alpine
COPY --from=BUILD_IMAGE /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
# Expose the port used by the React application
EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]
