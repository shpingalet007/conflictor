FROM alpine:3.10

WORKDIR conflictor

COPY . .

# COPY entrypoint.sh /entrypoint.sh
# COPY index.js /index.js

RUN apk add --no-cache git nodejs npm
RUN chmod +x /entrypoint.sh

RUN ls

ENTRYPOINT ["/entrypoint.sh"]
