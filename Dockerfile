FROM node:18  AS build

WORKDIR /app

# Set environment to development to include devDependencies
ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

RUN npm run build

# Production stage
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html/"poultry-hub"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
