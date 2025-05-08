# Declare phony targets (not associated with actual files)
.PHONY: all services-up services-down all-services-down client-install client-dev client-build client-start

# === Combined target ===

# Start everything: backend services and frontend dev server
all: services-up client-dev

# === Backend (services/) targets ===

# Create a shared network for the backend services
network:
	@if ! docker network inspect shared-network > /dev/null 2>&1; then \
		docker network create --driver overlay --attachable shared-network; \
		echo "Network 'shared-network' created."; \
	else \
		echo "Network 'shared-network' already exists."; \
	fi

# Build and start all database services in detached mode
db-up: network
	docker-compose --env-file .env -f ims-database/docker-compose.yml up --build -d

# Generate NGINX configuration
generate_default_nginx_conf:
	@echo "Generating NGINX configuration..."
	@echo "Please specify the service name (e.g., product, order,..):"
	chmod +x ./scripts/generate_default_nginx_conf.sh
	./scripts/generate_default_nginx_conf.sh $(SERVICE)

# Build and start backend services in detached mode
services-up: db-up generate_default_nginx_conf
	@echo "Preprocessing service data..."
	chmod +x ./scripts/run_services.sh
	./scripts/run_services.sh $(SERVICE)
	@echo "Starting gateway service..."
	docker-compose -f services/docker-compose-gateway.yml up --build -d
	@echo "Starting backend services..."
	docker-compose -f services/docker-compose-services.yml up --build -d $(SERVICE)

# Stop backend services
services-down:
	docker-compose -f services/docker-compose-services.yml down --remove-orphans

all-services-down:
	docker-compose -f services/docker-compose-gateway.yml down --remove-orphans
	docker-compose -f ims-database/docker-compose.yml down --remove-orphans

# Show logs from backend services
services-logs:
	docker-compose -f services/docker-compose.yml logs -f

# === Frontend (client/) targets ===

# Install frontend dependencies
client-install:
	cd client && npm install

# Run Next.js frontend in development mode (localhost:3000)
client-dev: client-install
	cd client && npm run dev

# Build the frontend for production
client-build: client-install
	cd client && npm run build

# Start the production server
client-start: client-build
	cd client && npm run start
