# 📌 Inventory Management System for Database Course

## 📄 Brief Description

The **Inventory Management System** is a full-stack web application built to streamline the tracking and management of stock, suppliers, and transactions for small to medium-sized businesses. It is developed as a final project for a university **Database Systems** course, showcasing solid relational database design, SQL programming (views, triggers, procedures), and integration with real-world tech tools.

This system solves the common issue of fragmented inventory records and manual errors by providing centralized, consistent, and real-time inventory control. It also extends traditional relational database capabilities with support for object storage (images, files) via **MinIO**.

---

## 🎯 Functional & Non-functional Requirements

### ✅ Functional Requirements

- User authentication with role-based access (Admin, Manager, Staff)
- Full CRUD operations for:
  - Products
  - Suppliers
  - Orders and inventory transactions
- Stock movement logging (inbound/outbound)
- Inventory threshold alerts (e.g., low stock)
- Document and image uploads (e.g., product photos, receipts)
- Reporting: inventory summaries, stock usage history
- Export reports as CSV or PDF
- Audit log for changes (trigger-based)

### ⚙️ Non-functional Requirements

- Fully normalized schema (to at least 3NF)
- Fast API responses with caching (Redis)
- Secure authentication (JWT, hashed passwords)
- ACID-compliant transactions
- Indexed queries for optimized performance
- Modular and containerized architecture (Docker-based)
- Responsive and intuitive UI (Next.js)
- CI/CD-enabled development workflow

---

## 🧱 Planned Core Entities (Brief Outline)

- **User**: Authenticated system user with role info
- **Product**: Core inventory item (with MinIO file reference for image)
- **Supplier**: Source of goods and stock
- **Order**: Represents inventory transactions (inbound/outbound)
- **InventoryLog**: Historical log of quantity changes
- **Customer**: End-user or client for whom the products are sold
- **Invoice**: Document representing a sale or purchase
- **Report**: Generated summaries or detailed reports for analysis

These entities will be connected using foreign keys, enforced by constraints and triggers, and accessed via stored procedures and views.

---

## 🔧 Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python), RESTful API
- **Databases**:
  - **MySQL**: Core relational data (normalized schema, foreign keys, procedures, views)
  - **Redis**: Caching, pub/sub for real-time UI sync
  - **MinIO**: Object storage for files (e.g., product images, invoices, reports)
- **Frontend**: [Next.js](https://nextjs.org/) (React-based frontend)
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy (or Prisma)
- **DB Migration Tool**: Alembic (schema versioning)
- **Validation**: Pydantic (FastAPI schema validation)
- **Deployment**: Docker, Docker Compose, Nginx-Proxy-Manager (reverse proxy), Portainer (container management)
- **CI/CD**: GitHub Actions for testing and deployment automation

---

## 👥 Team Members and Roles

| Name                | Role                                 |
|---------------------|--------------------------------------|
| Nguyen Xuan Truong  | Software developer                   |
| Le Ngoc Toan        | Software Developer                   |

---

## 📅 Timeline (Planned Milestones)

| Milestone                                       | Target Date    |
|--------------------------------------------------|----------------|
| ✅ Topic Approval & Team Registration             | May 6, 2025    |
| 📐 ER Diagram & Relational Schema Design          | May 10, 2025   |
| 🛠️ DDL Implementation (MySQL: Tables, FK, Indexes) | May 13, 2025   |
| 🔁 Triggers, Stored Procedures & Views            | May 16, 2025   |
| 🧪 Test Data Insertion & SQL Queries              | May 18, 2025   |
| 🔧 Backend API (FastAPI + Redis + MinIO)          | May 20, 2025   |
| 💻 Frontend UI (Next.js + API Integration)        | May 23, 2025   |
| 📊 Reporting Features (export to CSV/PDF)         | May 25, 2025   |
| 🚀 Final Submission, Demo, and Report             | May 27, 2025   |

---

> 🧠 This project integrates relational databases, object storage, caching, and modern web development to meet the educational objectives of the Database Systems course while solving a real-world business problem.

## 📜 How to run this

### Prerequisites

Make sure you have the following installed:

- Docker [https://docs.docker.com/get-docker/]
- Docker Compose [https://docs.docker.com/compose/install/]
- make (if you are using Windows, you can use WSL2 to install make or use the make command in Git Bash) [https://www.gnu.org/software/make/]

### Steps to run the project

1. Clone the repository:

    ```bash
   git clone git@github.com:truongng201/Database-IMS-Project.git
    cd Database-IMS-Project
    ```

2. Add your environment variables in the `.env` file. You can use the `.template.env` file as a template.

3. Build and run the services:

  ```bash
      # Make sure in the root directory of the project and down all the services first
    make services-down # To stop all the services then you can run the services normally
      # To build the services
    make services-up SERVICE='product' # To run the product service
      # or
    make services-up SERVICE='product order' # To run the product and order services

    make services-down # To stop the services

      # To run client service
    make client-dev # To run the client service
    make client-build # To build the client service
    make client-start # To run the client service in build mode

      # To run the all service
    make all # To run all services
  ```

## 🖥️ Accessing the Application 

1. Access the application:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Services: formatted as: <http://localhost:8080/v1/{service_name}>
      - For example:
        - Product: [http://localhost:8080/v1/product](http://localhost:8080/v1/product)
        - Order: [http://localhost:8080/v1/order](http://localhost:8080/v1/order)
    - MinIO: [http://localhost:9001](http://localhost:9001) (Console address with credentials from `.env`)
    - MySQL Workbench or any other MySQL client to connect to the database.

2. Access from the production environment:
    - Frontend: [https://vinuni-database-ims.duckdns.org](https://vinuni-database-ims.duckdns.org)
    - Services: formatted as: <https://api.vinuni-database-ims.duckdns.org/v1/{service_name}>
      - For example:
        - Product: [https://api.vinuni-database-ims.duckdns.org/v1/product](https://api.vinuni-database-ims.duckdns.org/v1/product)
        - Order: [https://api.vinuni-database-ims.duckdns.org/v1/order](https://api.vinuni-database-ims.duckdns.org/v1/order)
      - You can follow the health check of the services at - Product: [https://api.vinuni-database-ims.duckdns.org/v1/product/health](https://api.vinuni-database-ims.duckdns.org/v1/product/health).
        - The response should be like this - the version here is the commit hash of the last commit that was pushed to the main branch.

        ```json
        {
          "status": "product service is running with version d188e5be017ac569fdfd6894cd76bfed9ff02ac3",
        }
        ```

    - MinIO: [https://minio.vinuni-database-ims.duckdns.org](https://minio.vinuni-database-ims.duckdns.org) (Ask the team for credentials)
    - Portainer: [https://portainer.vinuni-database-ims.duckdns.org](https://portainer.vinuni-database-ims.duckdns.org) (Ask the team for credentials)
    - ProxyManager: [https://proxy-manager.vinuni-database-ims.duckdns.org](https://proxy-manager.vinuni-database-ims.duckdns.org) (Ask the team for credentials)
