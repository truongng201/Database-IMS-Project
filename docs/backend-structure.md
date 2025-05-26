# Backend Services Structure

The backend of the Inventory Management System (IMS) is built using a microservices architecture. Each service is responsible for a specific domain and communicates with other services through well-defined APIs.

## Overview

The backend is organized into the following main directories:

- `services/` - Contains all microservices
- `docker-compose-services.yml` - Docker Compose configuration for all services
- `docker-compose-gateway.yml` - Docker Compose configuration for the API gateway

## Services Architecture

The system is composed of the following microservices:

### 1. Gateway Service (`services/gateway`)

The API Gateway acts as the entry point for all client requests. It's responsible for:
- Routing requests to the appropriate microservices
- Authentication and authorization
- Request/response transformation
- Rate limiting and circuit breaking

### 2. Customer Service (`services/customer`)

Manages all customer-related operations:
- Customer registration and profile management
- Customer search and filtering
- Address and contact information management
- Customer order history

### 3. Product Service (`services/product`)

Handles all product-related operations:
- Product creation, update, and deletion
- Product categorization
- Inventory tracking
- Price management

### 4. Order Service (`services/order`)

Manages order processing:
- Order creation and management
- Order status tracking
- Order history
- Integration with payment systems

### 5. Supplier Service (`services/supplier`)

Handles all supplier-related operations:
- Supplier management
- Purchase orders
- Supplier performance tracking
- Contract management

### 6. User Service (`services/user`)

Manages user accounts for the system:
- User authentication and authorization
- Role-based access control
- User profile management
- Password management and security

### 7. Shared Library (`services/shared`)

Contains shared code and utilities used by multiple services:
- Common data models
- Database utilities
- Messaging patterns
- Authentication utilities

## Communication Patterns

The services communicate using:
- REST APIs for synchronous communication
- Message queues for asynchronous communication

## Database Structure

Each microservice has its own database to ensure loose coupling. The databases are:
- PostgreSQL for relational data
- MongoDB for document-based data
- Redis for caching

## Deployment

The services are containerized using Docker and can be deployed together using Docker Compose or orchestrated with Kubernetes in production.

## Running the Backend

To start all services:

```bash
docker-compose -f services/docker-compose-services.yml up
```

To start only the API gateway:

```bash
docker-compose -f services/docker-compose-gateway.yml up
``` 