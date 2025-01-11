FROM golang:1.23.4-bookworm AS development

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Our Makefile / env fully supports parallel job execution
ENV MAKEFLAGS "-j 8 --no-print-directory"

# Install required system dependencies
RUN apt-get update \
    && apt-get install -y \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# linux permissions / vscode support: Add user to avoid linux file permission issues
# Detail: Inside the container, any mounted files/folders will have the exact same permissions
# as outside the container - including the owner user ID (UID) and group ID (GID).
# Because of this, your container user will either need to have the same UID or be in a group with the same GID.
# The actual name of the user / group does not matter. The first user on a machine typically gets a UID of 1000,
# so most containers use this as the ID of the user to try to avoid this problem.
# 2020-04: docker-compose does not support passing id -u / id -g as part of its config, therefore we assume uid 1000
# https://code.visualstudio.com/docs/remote/containers-advanced#_adding-a-nonroot-user-to-your-dev-container
# https://code.visualstudio.com/docs/remote/containers-advanced#_creating-a-nonroot-user
ARG USERNAME=development
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME

# linux permissions / vscode support: chown $GOPATH so $USERNAME can directly work with it
# Note that this should be the final step after installing all build deps
RUN mkdir -p /$GOPATH/pkg && chown -R $USERNAME /$GOPATH

# $GOBIN is where our own compiled binaries will live and other go.mod / VSCode binaries will be installed.
# It should always come AFTER our other $PATH segments and should be earliest targeted in stage "builder",
# as /app/bin will the shadowed by a volume mount via docker-compose!
# E.g. "which golangci-lint" should report "/go/bin" not "/app/bin" (where VSCode will place it).
# https://github.com/go-modules-by-example/index/blob/master/010_tools/README.md#walk-through
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

FROM debian:bullseye-slim as app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create app user and directory structure first
RUN useradd -r -u 1000 -g root appuser && \
    mkdir -p /app/assets/images && \
    chown -R 1000:1000 /app && \
    chmod -R 777 /app

COPY --from=builder /app/bin/app .
COPY --from=builder /app/api/swagger.yml ./api/
COPY --from=builder /app/assets ./assets/
COPY --from=builder /app/sql/schema ./migrations/
COPY --from=builder /app/web ./web/

# Ensure permissions are set after copying files
RUN chown -R 1000:1000 /app && \
    chmod -R 777 /app/assets

# Switch to non-root user
USER 1000:1000

EXPOSE 9973

# Ensure volume has correct ownership
VOLUME ["/app/assets"]

ENTRYPOINT ["/app/app"]
CMD ["server"]
