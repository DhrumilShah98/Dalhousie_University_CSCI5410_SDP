FROM node:alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]

# docker build -t container_3_app .
# docker image ls
# docker run -d -p 3002:3000 container_3_app