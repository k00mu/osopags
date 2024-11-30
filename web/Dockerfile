FROM denoland/deno:alpine

WORKDIR /app

COPY . /app

EXPOSE ${WEB_PORT}
CMD [ "deno", "task", "dev" ]