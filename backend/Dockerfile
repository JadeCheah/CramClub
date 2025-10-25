# --- build stage ---
FROM golang:1.23.5 AS builder
ENV GOTOOLCHAIN=auto 
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server main.go

# --- run stage (minimal) ---
FROM gcr.io/distroless/base-debian12
WORKDIR /srv
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
