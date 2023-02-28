FROM node:18-alpine
#set working directory
RUN apk add --no-cache python3 g++ make
WORKDIR /usr/src/app
COPY . .
#use yarn to install dependencies
#add git to install dependencies from git
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++
RUN apk add --no-cache git
COPY yarn.lock package.json ./
RUN yarn install
#copy all files
COPY . .
EXPOSE 9091
EXPOSE 9092
EXPOSE 9093
EXPOSE 9094
EXPOSE 9095
CMD ["node", "server.js"]