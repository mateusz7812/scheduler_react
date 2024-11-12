#FROM node:alpine as build
#WORKDIR /app

#ENV PATH /app/node_modules/.bin:$PATH
#RUN apk --no-cache add git
#RUN git clone https://github.com/mateusz7812/scheduler_react.git
#WORKDIR /app/scheduler_react
#RUN npm install -force
#CMD [ "npm", "start" ]

#RUN npm run build

#FROM nginx:stable-alpine
#COPY default.conf.template /etc/nginx/templates/default.conf.template
#COPY --from=build /app/scheduler_react/build /usr/share/nginx/html
#CMD ["nginx", "-g", "daemon off;"]

FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install -force
COPY . ./
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
RUN npm run build

FROM nginx
EXPOSE 80
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]