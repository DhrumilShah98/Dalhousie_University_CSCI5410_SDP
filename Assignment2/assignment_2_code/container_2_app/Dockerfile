FROM node:alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]

# docker build -t container_2_app .
# docker image ls
# docker run -d -p 3001:3000 container_2_app