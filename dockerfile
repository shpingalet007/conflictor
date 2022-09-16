FROM alpine:3.10

COPY entrypoint.sh /entrypoint.sh

RUN apk add --no-cache git nodejs npm
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
