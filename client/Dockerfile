# ------ Stage 1 ------ #
# Pull base image
FROM node:alpine as build-step

# Setting work directory
WORKDIR /app

COPY build /app/build
 
# ENV IMGFA_HOST=127.0.0.1
# ENV IMGFA_PORT=16147
# ENV TRAINER_PORT=16147

# ------ Stage 2 ------ #
FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
EXPOSE 80