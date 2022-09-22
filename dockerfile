FROM alpine:3.10

WORKDIR conflictor

COPY . .

RUN ls

# COPY entrypoint.sh /entrypoint.sh
# COPY index.js /index.js

RUN apk add --no-cache git nodejs npm
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
