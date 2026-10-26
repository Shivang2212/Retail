# 🌿 Retail Inventory Management System

[![CI / Build & Test](https://github.com/Shivang2212/Retail_03/actions/workflows/ci.yml/badge.svg)](https://github.com/Shivang2212/Retail_03/actions/workflows/ci.yml)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3%2B-6DB33F?logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-18%2B%20%2F%2022-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, full-stack **Retail Inventory Management System** built with **Java Spring Boot**, **PostgreSQL**, and a high-performance **Angular** frontend styled in an elegant **Dark Green + White** palette. Designed for real-time stock control, supplier procurement, multi-warehouse tracking, sales management, and role-based operational analytics.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [UI & Design System](#-ui--design-system)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Configuration](#-environment-configuration)
- [REST API Reference](#-rest-api-reference)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributing & License](#-contributing--license)

---

## ✨ Key Features

### 📦 Inventory & Catalog Management
- **Product Catalog**: Add, edit, filter, and track products with SKUs, pricing, stock levels, and category classification.
- **Multi-Warehouse Support**: Allocate and monitor inventory across multiple physical locations.
- **Stock Movement Audits**: Track every `IN` and `OUT` transaction with automatic ledger updates and reason logging.
- **Low-Stock Alerts**: Instant warnings for items nearing critical reorder thresholds.

### 🔄 Order & Procurement Lifecycle
- **Sales Orders**: Create orders, link customers, track order status (`PENDING`, `COMPLETED`, `CANCELLED`), and automatically deduct stock.
- **Purchase Orders**: Manage vendor procurement; receiving shipments automatically increments warehouse stock and logs movements.
- **Suppliers & Customers Directory**: Complete CRM and vendor management with contact logs and purchase history.

### 📊 Real-Time Analytics & Dashboard
- Aggregate KPI cards for total products, active suppliers, categories, low-stock items, and revenue.
- Quick navigation shortcuts for high-frequency inventory operations.

### ⚡ Performance & UX
- **Zero-Latency Optimistic UI**: Instantaneous response on additions, edits, and deletions with zero perceived lag.
- **JWT Authentication & RBAC**: Secure access with access/refresh tokens and role-based permissions (`ADMIN`, `MANAGER`, `USER`).
- **Snappy Slide-Out Drawers**: Fast, hardware-accelerated drawer panels for seamless data entry without leaving the table view.

---

## 🏛 System Architecture

```
+-------------------------------------------------------------+
|                     Angular Frontend                        |
|   (Standalone Components, RxJS, Interceptors, SCSS Theme)   |
+------------------------------+------------------------------+
                               |  HTTP / REST / JWT
                               v
+-------------------------------------------------------------+
|                  Spring Boot REST Backend                   |
|  +-------------------------------------------------------+  |
|  | Security & Filters (JWT Auth, Rate Limit, Headers)    |  |
|  +-------------------------------------------------------+  |
|  | Controllers (Products, Orders, Stock, Suppliers, etc.)|  |
|  +-------------------------------------------------------+  |
|  | Business Services & Transaction Management            |  |
|  +-------------------------------------------------------+  |
|  | Spring Data JPA Repositories / Hibernate              |  |
|  +-------------------------------------------------------+  |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     PostgreSQL Database                     |
|            (Tables, Constraints, Indexes, Auditing)         |
+-------------------------------------------------------------+
```

---

## 🎨 UI & Design System

The application features a modern **Dark Green + White** color palette crafted for clarity, contrast, and visual comfort:

| Design Token | Value | Description |
|---|---|---|
| `--primary-color` | `#16a34a` | Forest Green accent for primary buttons and highlights |
| `--primary-hover` | `#15803d` | Deep Green hover state |
| `--primary-glow` | `rgba(22, 163, 74, 0.25)` | Soft focus rings and active glow effects |
| `--bg-dark` | `#f0fdf4` | Mint-tinted pale background for high-contrast readability |
| `--bg-card` | `#ffffff` | Clean white cards and modal backgrounds |
| `--border-color` | `#86efac` | Subtle green borders |
| `--text-primary` | `#052e16` | Deep emerald black for typography |
| `--text-secondary`| `#166534` | Subdued green for metadata and labels |

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Angular 18+ (Standalone Components, Signals, Router)
- **Styling**: SCSS with custom design tokens, FontAwesome icons, Inter typography
- **State & Reactivity**: RxJS, HttpClient with JWT Interceptors, ChangeDetector optimization
- **Build Tool**: Angular CLI / Vite builder

### Backend
- **Framework**: Spring Boot 3+ / 4 (Java 21)
- **Security**: Spring Security, JWT (Access & Refresh tokens), BCrypt hashing
- **Persistence**: Spring Data JPA, Hibernate ORM
- **Database**: PostgreSQL (compatible with Supabase, AWS RDS, Docker, and local PostgreSQL)
- **Build & Dependency Management**: Apache Maven (`mvnw`)

### DevOps & Tools
- **CI/CD**: GitHub Actions (automated builds, tests with containerized PostgreSQL)
- **Containerization**: Docker / Docker Compose ready

---

## 📁 Project Structure

```
Retail_03/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
└── retail-inventory-main/
    ├── backend/                 # Spring Boot application
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/com/retail/inventory/
    │   │   │   │   ├── config/      # Security, CORS, JWT filters
    │   │   │   │   ├── controller/  # REST API endpoints
    │   │   │   │   ├── model/       # JPA entities
    │   │   │   │   ├── repository/  # Data repositories
    │   │   │   │   └── service/     # Business logic
    │   │   │   └── resources/
    │   │   │       └── application.properties
    │   │   └── test/            # JUnit & Mockito unit tests
    │   ├── mvnw / mvnw.cmd      # Maven wrappers
    │   └── pom.xml              # Maven configuration
    │
    └── frontend/                # Angular application
        ├── src/
        │   ├── app/
        │   │   ├── core/        # Interceptors, guards, toast services
        │   │   ├── layout/      # Sidebar, topbar, navigation shell
        │   │   ├── pages/       # Products, categories, orders, etc.
        │   │   └── services/    # HTTP client API services
        │   ├── environments/    # Environment configurations
        │   └── styles.scss      # Global theme & design tokens
        ├── angular.json         # Angular workspace configuration
        └── package.json         # Frontend dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 21+ installed and on `PATH`
- **Node.js**: v20 or v22 (LTS recommended) and `npm`
- **PostgreSQL**: v14+ running locally or a hosted PostgreSQL instance (e.g., Supabase / Neon)
- **Git**

---

### 1. Database Setup
Create a PostgreSQL database named `retail`:

```sql
CREATE DATABASE retail;
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd retail-inventory-main/backend
   ```

2. Configure your database credentials in `src/main/resources/application.properties` or via environment variables:
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/retail
   export DB_USERNAME=postgres
   export DB_PASSWORD=your_password
   ```

3. Build and run the backend:
   ```bash
   # Linux / macOS
   ./mvnw clean spring-boot:run

   # Windows
   .\mvnw.cmd clean spring-boot:run
   ```

The backend REST API will start at: `http://localhost:8080`

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd retail-inventory-main/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

---

## ⚙️ Environment Configuration

### Backend (`application.properties`)
| Variable | Default Value | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/retail` | JDBC connection string |
| `DB_USERNAME` | `postgres` | Database username |
| `DB_PASSWORD` | `postgres` | Database password |
| `server.port` | `8080` | Port for Spring Boot |
| `jwt.secret` | `3f2a1b9c8d...` | Secret key for signing JWT tokens |
| `jwt.access-token-expiration` | `900000` (15 min) | Access token validity in ms |
| `jwt.refresh-token-expiration`| `604800000` (7 days) | Refresh token validity in ms |

### Frontend (`environment.ts`)
| Variable | Default Value | Description |
|---|---|---|
| `apiUrl` | `http://localhost:8080/api` | Base URL for REST API calls |

---

## 📡 REST API Reference

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register a new user |
| | `POST` | `/api/auth/login` | Authenticate and obtain JWT tokens |
| **Products** | `GET` | `/api/products` | List all products (supports `?categoryId`, `?supplierId`, `?search`) |
| | `POST` | `/api/products` | Create a new product |
| | `PUT` | `/api/products/{id}` | Update product details |
| | `DELETE`| `/api/products/{id}` | Remove a product |
| **Categories** | `GET` | `/api/categories` | Retrieve all product categories |
| | `POST` | `/api/categories` | Create a category |
| | `PUT` | `/api/categories/{id}` | Update category name / description |
| | `DELETE`| `/api/categories/{id}` | Delete category |
| **Inventory** | `GET` | `/api/inventory` | View current stock across warehouses |
| | `GET` | `/api/inventory/low-stock`| Filter items below stock threshold |
| | `POST` | `/api/inventory` | Allocate inventory |
| | `PUT` | `/api/inventory/{id}` | Adjust quantity |
| **Orders** | `GET` | `/api/orders` | List sales orders |
| | `POST` | `/api/orders` | Place sales order & deduct stock |
| | `PUT` | `/api/orders/{id}/status` | Update order fulfillment status |
| **Purchase Orders** | `GET` | `/api/purchase-orders` | View vendor purchase orders |
| | `POST` | `/api/purchase-orders` | Issue purchase order to supplier |
| | `PUT` | `/api/purchase-orders/{id}/status` | Receive goods & increment stock |
| **Stock Movements** | `GET` | `/api/stock-movements` | Audit log of all stock changes |
| | `POST` | `/api/stock-movements` | Record manual adjustment (IN/OUT) |
| **Suppliers** | `GET` | `/api/suppliers` | List suppliers & vendor info |
| **Customers** | `GET` | `/api/customers` | List customer accounts |
| **Warehouses** | `GET` | `/api/warehouses` | List storage facilities |
| **Dashboard** | `GET` | `/api/dashboard` | Aggregated analytics & metrics |

---

## 🔄 CI/CD Pipeline

The repository includes a GitHub Actions workflow located at [`.github/workflows/ci.yml`](.github/workflows/ci.yml) that automatically runs on every push and pull request to `main`:

- **Backend CI**:
  - Sets up Java 21 with Temurin JDK.
  - Spins up a real **PostgreSQL 16** service container.
  - Builds and tests the Spring Boot application using Maven.
  - Archives and uploads the compiled JAR artifact.
- **Frontend CI**:
  - Sets up Node.js 22 with npm dependency caching.
  - Runs `npm ci` for deterministic package installation.
  - Compiles the Angular production bundle with budget verification.
  - Archives and uploads the production `dist/` bundle.

---

## 📄 License & Credits

This project is licensed under the [MIT License](LICENSE).

Developed and maintained by **[Shivang2212](https://github.com/Shivang2212)**. Contributions, suggestions, and pull requests are always welcome!
