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
- **Deployment**: Docker, Docker Compose, Nginx (reverse proxy)
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

### Initialize the project

1. **Install Docker**: Make sure you have Docker installed on your machine. You can download it from [Docker's official website](https://www.docker.com/get-started).

2. **Clone the repository**: Clone this repository to your local machine using the following command:

  ```bash
  git clone git@github.com:truongng201/Database-IMS-Project.git
  ```