<div align="center">
  <br />

  <h1 align="center">POLABDC</h1>

  <p align="center">
    <strong>The Next-Gen AI-Powered Dental Clinic Management System</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Frontend-Next.js_14-black?style=flat-square&logo=next.js" alt="NextJS">
    <img src="https://img.shields.io/badge/Backend-Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="ExpressJS">
    <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/AI-Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  </p>

  <br />
</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#1-database-setup)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
  - [AI Service Setup](#4-ai-service-setup)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏥 About The Project

**RoxyDental** is a comprehensive SaaS solution designed to digitize dental clinic operations. Unlike traditional management systems, RoxyDental integrates **Artificial Intelligence** to assist doctors with predictions and provides a seamless experience for patients, nurses, and administrators.

The system is built as a **Monorepo**, separating the client (Next.js), server (Express.js), and AI processing unit (Python) to ensure scalability and maintainability.

---

## 🌟 Key Features

### 👨‍⚕️ For Dentists (Doctors)
* **Smart Dashboard:** Overview of daily appointments and financial stats.
* **Digital EMR:** Complete Electronic Medical Records with history tracking.
* **Treatment Management:** Record treatments, prescriptions, and notes.
* **AI Assistant:** Intelligent disease prediction and data analysis.

### 👩‍⚕️ For Nurses
* **Queue Management:** Real-time patient queue handling.
* **Vitals Recording:** Pre-consultation checks (Blood pressure, etc.).
* **Patient Registration:** Streamlined new patient onboarding.

### 💼 Operational
* **Scheduling System:** Conflict-free calendar for appointments.
* **Finance & Billing:** Automated invoicing and revenue tracking.
* **Role-Based Access Control (RBAC):** Secure access for different user roles.

---

## 🏗 System Architecture

The project follows a Microservices-like architecture:

1.  **Frontend (`/frontend`):** Next.js App Router for UI/UX.
2.  **Backend (`/backend`):** Express.js REST API handling business logic and database interactions via Prisma.
3.  **AI Engine (`/roxydental-ai`):** Python-based service for machine learning predictions.
4.  **Database:** PostgreSQL hosted on Supabase.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** | React Framework with App Router |
| | **Tailwind CSS** | Utility-first CSS framework |
| | **shadcn/ui** | Reusable UI components |
| | **TypeScript** | Static typing for safety |
| **Backend** | **Express.js** | Fast, unopinionated web framework for Node.js |
| | **Prisma** | Next-generation Node.js and TypeScript ORM |
| | **JWT** | Secure Authentication |
| **Database** | **Supabase** | Managed PostgreSQL & Storage |
| **AI / ML** | **Python** | For data processing and prediction models |
| **DevOps** | **Docker** | (Optional) Containerization |

---

## 📂 Directory Structure

```text
RoxyDental/
├── backend/                # Express.js API Server
│   ├── prisma/             # Database Schema & Migrations
│   ├── src/
│   │   ├── controllers/    # Request Handlers
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # Business Logic
│   │   └── middlewares/    # Auth & Validation
│   └── ...
├── frontend/               # Next.js Client Application
│   ├── src/
│   │   ├── app/            # App Router Pages
│   │   ├── components/     # UI Components (shadcn)
│   │   └── services/       # API Integration
│   └── ...
├── roxydental-ai/          # Python AI Services
│   ├── api.py              # AI Endpoints
│   └── ...
└── README.md

```

---

## 🚀 Getting Started

Follow these steps to run the complete system locally.

### Prerequisites

* Node.js (v18+)
* Python (v3.9+)
* PostgreSQL (or Supabase account)
* npm or yarn

### 1. Database Setup

1. Create a project on [Supabase](https://supabase.com/).
2. Get your **Database Connection String** (URI) and **API Keys**.

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend

```

Install dependencies:

```bash
npm install

```

Set up environment variables:

```bash
cp .env.example .env
# Edit .env and fill in DATABASE_URL, JWT_SECRET, SUPABASE_URL, etc.

```

Run Database Migrations (Prisma):

```bash
npx prisma migrate dev --name init

```

Start the Server:

```bash
npm run dev
# Server running at http://localhost:5000

```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend

```

Install dependencies:

```bash
npm install

```

Set up environment variables:
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

```

Start the Client:

```bash
npm run dev
# Client running at http://localhost:3000

```

### 4. AI Service Setup

Open a new terminal for the AI engine:

```bash
cd roxydental-ai

```

Create a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

```

Install dependencies (assuming requirements.txt exists, or install manually):

```bash
pip install flask scikit-learn pandas numpy
# Or if you have a requirements file: pip install -r requirements.txt

```

Start the AI Server:

```bash
python api.py
# AI Service likely running at http://localhost:8000 or 5001

```

---

## 🔐 Environment Variables

Ensure you have the following variables configured in your `.env` files.

**Backend (`backend/.env`):**

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/postgres?pgbouncer=true"
JWT_SECRET="your_super_secure_secret"
SUPABASE_URL="[https://your-project.supabase.co](https://your-project.supabase.co)"
SUPABASE_KEY="your-service-role-key"

```

**Frontend (`frontend/.env.local`):**

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"

```

---
