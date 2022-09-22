FROM alpine:3.10

WORKDIR conflictor

COPY entrypoint.sh /entrypoint.sh
COPY index.js /index.js

RUN ls conflictor

# COPY entrypoint.sh /entrypoint.sh
# COPY index.js /index.js

RUN apk add --no-cache git nodejs npm
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
