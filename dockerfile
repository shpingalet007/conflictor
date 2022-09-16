FROM alpine:3.10

COPY entrypoint.sh /entrypoint.sh

RUN apk add --no-cache git
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
