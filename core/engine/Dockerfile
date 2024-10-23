FROM denoland/deno:alpine

WORKDIR /app

COPY . /app

RUN deno install --entrypoint ./src/main.ts

RUN deno cache ./src/main.ts

EXPOSE ${ENGINE_PORT}
CMD [ "deno", "task", "dev" ]