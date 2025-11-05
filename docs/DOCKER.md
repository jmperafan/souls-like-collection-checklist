# Docker Setup Guide

Run the Souls-like Collection Tracker using Docker for easy deployment and consistent environment.

## Quick Start

### 1. Start the Website

```bash
# Build and start the container
docker compose up -d

# Or rebuild if you made changes
docker compose up -d --build
```

The website will be available at: **http://localhost:8080**

### 2. Stop the Website

```bash
docker compose down
```

## Prerequisites

- Docker installed: https://docs.docker.com/get-docker/
- Docker Compose installed (included with Docker Desktop)

## What's Included

### Web Service
- **Container**: `soulslike-collection`
- **Port**: 8080 (maps to container port 80)
- **Server**: Nginx (lightweight, production-ready)
- **Auto-restart**: Yes (unless manually stopped)
- **Health check**: Monitors container health

### Scripts Service (Optional)
- **Container**: `soulslike-scripts`
- **Purpose**: Run automation scripts locally
- **Node version**: 20 (Alpine Linux)
- **Profile**: Only starts when explicitly requested

## Usage

### Basic Commands

```bash
# Start website
docker compose up -d

# View logs
docker compose logs -f web

# Stop website
docker compose down

# Restart website
docker compose restart web

# Rebuild after code changes
docker compose up -d --build
```

### Running Automation Scripts

The scripts container is optional and uses Docker profiles:

```bash
# Start both web and scripts containers
docker compose --profile scripts up -d

# Run price update script
docker compose exec scripts npm run update-prices

# Run Reddit search script
docker compose exec scripts npm run search-reddit

# Run both scripts
docker compose exec scripts npm run update-all

# View scripts container logs
docker compose logs -f scripts

# Stop everything including scripts
docker compose --profile scripts down
```

### Environment Variables for Scripts

Create a `.env` file in the project root:

```bash
# Copy template
cp scripts/.env.example .env

# Edit with your API keys
nano .env
```

Add your API keys:
```env
PRICECHARTING_API_KEY=your_api_key_here
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=GameCollectionBot/1.0.0 (by /u/your_username)
```

Docker Compose will automatically load these variables for the scripts container.

## Docker Architecture

### Dockerfile
- **Base Image**: `nginx:alpine` (minimal, secure)
- **Size**: ~25MB (very lightweight!)
- **Files**: Copies only necessary web files (HTML, CSS, JS)
- **Security**: Runs as non-root user (nginx default)

### docker compose.yml
- **Version**: 3.8 (modern Docker Compose format)
- **Services**: Web (always), Scripts (optional with `--profile scripts`)
- **Networking**: Default bridge network
- **Volumes**: Scripts directory mounted for development
- **Health Checks**: Web service monitored automatically

## Customization

### Change Web Port

Edit `docker compose.yml`:

```yaml
services:
  web:
    ports:
      - "3000:80"  # Change 8080 to your preferred port
```

### Custom Nginx Configuration

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(css|js)$ {
        expires 1h;
        add_header Cache-Control "public, immutable";
    }
}
```

Update `Dockerfile`:
```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## Troubleshooting

### Port Already in Use

If port 8080 is taken:

```bash
# Check what's using the port
sudo lsof -i :8080

# Kill the Python server from earlier
kill $(lsof -t -i:8000)

# Or change the port in docker compose.yml
```

### Container Won't Start

```bash
# Check logs
docker compose logs web

# Remove and rebuild
docker compose down
docker compose up -d --build

# Check container status
docker ps -a
```

### Scripts Container Issues

```bash
# Check if .env file exists
ls -la .env

# View scripts container logs
docker compose --profile scripts logs scripts

# Restart scripts container
docker compose --profile scripts restart scripts

# Enter container for debugging
docker compose exec scripts sh
```

### Cannot Connect to Website

```bash
# Verify container is running
docker ps

# Check health status
docker inspect soulslike-collection | grep Health -A 5

# Test from inside container
docker exec soulslike-collection wget -O- http://localhost:80

# Restart container
docker compose restart web
```

## Development Workflow

### Making Changes

1. Edit your files (HTML, CSS, JS)
2. Rebuild and restart:
   ```bash
   docker compose up -d --build
   ```
3. Refresh browser at http://localhost:8080

### Live Development

For faster development without rebuilding:

```bash
# Stop Docker container
docker compose down

# Use Python server instead
python3 -m http.server 8080

# Make changes and refresh browser
# Files reload automatically
```

When done developing, switch back to Docker:
```bash
# Stop Python server (Ctrl+C)
# Rebuild Docker
docker compose up -d --build
```

## Production Deployment

### Docker Hub

Build and push to Docker Hub:

```bash
# Build image
docker build -t yourusername/soulslike-collection:latest .

# Test locally
docker run -d -p 8080:80 yourusername/soulslike-collection:latest

# Push to Docker Hub
docker login
docker push yourusername/soulslike-collection:latest
```

### Deploy to Server

On your server:

```bash
# Pull image
docker pull yourusername/soulslike-collection:latest

# Run container
docker run -d \
  --name soulslike-collection \
  --restart unless-stopped \
  -p 80:80 \
  yourusername/soulslike-collection:latest
```

### Using Docker Compose on Server

```bash
# Copy docker compose.yml to server
scp docker compose.yml user@server:/path/to/app/

# SSH to server
ssh user@server

# Start services
cd /path/to/app
docker compose up -d
```

## Multi-Platform Builds

Build for multiple architectures (useful for ARM servers like Raspberry Pi):

```bash
# Enable buildx
docker buildx create --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t yourusername/soulslike-collection:latest \
  --push .
```

## Resource Usage

Expected resource consumption:

- **CPU**: <1% idle, <5% active
- **Memory**: ~10MB for nginx container
- **Memory**: ~80MB for scripts container (Node.js)
- **Disk**: ~25MB for web image, ~150MB for scripts image
- **Network**: Minimal (static files only)

## Security Best Practices

1. **Don't commit .env file**: Already in `.gitignore`
2. **Use secrets for production**: Not environment variables
3. **Update base images regularly**:
   ```bash
   docker compose pull
   docker compose up -d --build
   ```
4. **Run as non-root**: Already configured in nginx image
5. **Enable health checks**: Already configured in docker compose.yml

## Cleanup

Remove all containers and images:

```bash
# Stop and remove containers
docker compose down

# Remove images
docker rmi soulslike-collection-web
docker rmi soulslike-collection-scripts

# Remove all unused Docker resources
docker system prune -a
```

## Alternative: Docker Run

If you prefer `docker run` over `docker compose`:

```bash
# Build image
docker build -t soulslike-collection .

# Run container
docker run -d \
  --name soulslike-collection \
  --restart unless-stopped \
  -p 8080:80 \
  soulslike-collection

# Stop container
docker stop soulslike-collection

# Remove container
docker rm soulslike-collection
```

## Docker Desktop GUI

If using Docker Desktop, you can:

1. View containers in the GUI
2. Start/stop with one click
3. View logs in real-time
4. Access container shell
5. Monitor resource usage

---

## Quick Reference

```bash
# Start website
docker compose up -d

# View at
http://localhost:8080

# Stop website
docker compose down

# Run scripts (with API keys in .env)
docker compose --profile scripts up -d
docker compose exec scripts npm run update-prices

# Rebuild after changes
docker compose up -d --build

# View logs
docker compose logs -f web
```

**Tip**: Add an alias to your shell profile:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias souls-up='docker compose up -d'
alias souls-down='docker compose down'
alias souls-logs='docker compose logs -f web'
alias souls-rebuild='docker compose up -d --build'

# Then use:
souls-up
souls-logs
```

Happy collecting! 🎮
