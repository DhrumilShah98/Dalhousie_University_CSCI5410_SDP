FROM node:alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]

# docker build -t container_1_app .
# docker image ls
# docker run -d -p 3000:3000 container_1_app