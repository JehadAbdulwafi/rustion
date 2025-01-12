FROM golang:1.23.4-bookworm AS development
ENV DEBIAN_FRONTEND=noninteractive
ENV MAKEFLAGS "-j 8 --no-print-directory"
RUN apt-get update \
    && apt-get install -y \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ARG USERNAME=development
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME

RUN chown -R $USERNAME /$GOPATH

# # Create assets directory and set proper permissions
# RUN mkdir -p /app/assets/images && \
#     chown -R $USERNAME:$USERNAME /app/assets

WORKDIR /app
ENV GOBIN /app/bin
ENV PATH $PATH:$GOBIN

### -----------------------
# --- Stage: builder
# --- Purpose: Statically built binaries and CI environment
### -----------------------

FROM development as builder
WORKDIR /app
COPY Makefile /app/Makefile
COPY go.mod /app/go.mod
COPY go.sum /app/go.sum
RUN go mod download
COPY . /app/
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o bin/app main.go
RUN chmod a+x /app/bin/app

# RUN chown -R 65532:65532 /app/assets && \
#     chmod -R 755 /app/assets

# FROM gcr.io/distroless/static-debian12:nonroot as app

FROM alpine:latest

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/


WORKDIR /app

COPY --from=builder /app/bin/app .
COPY --from=builder /app/api/swagger.yml ./api/
COPY --from=builder /app/assets ./assets/
COPY --from=builder /app/sql/schema ./migrations/
COPY --from=builder /app/web ./web/

EXPOSE 9973

ENTRYPOINT ["/app/app"]
CMD ["server"]

VOLUME ["/app/assets"]
