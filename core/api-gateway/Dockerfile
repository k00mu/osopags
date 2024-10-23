FROM denoland/deno:alpine

WORKDIR /app

COPY . /app

RUN deno install --entrypoint ./main.ts

RUN deno cache ./main.ts

EXPOSE ${API_GATEWAY_PORT}
CMD [ "deno", "task", "dev" ]
