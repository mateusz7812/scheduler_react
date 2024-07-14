FROM node:13.12.0-alpine as build
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache add git
RUN git clone https://github.com/mateusz7812/scheduler_react.git
WORKDIR /app/scheduler_react
RUN npm install
CMD [ "npm", "start" ]
#RUN npm run build

#FROM nginx:stable-alpine
#COPY default.conf.template /etc/nginx/templates/default.conf.template
#COPY --from=build /app/scheduler_react/build /usr/share/nginx/html
#CMD ["nginx", "-g", "daemon off;"]