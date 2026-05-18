# GigFlow – Smart Leads Dashboard

> A smart, role-based Lead Management Dashboard built for sales teams to track, manage, and analyze their leads efficiently.

## 🎯 About The Project

GigFlow is a full-stack Lead Management System built with the MERN stack. It helps sales teams manage their leads in one place — track status, filter by source, search by name, and visualize performance through charts.

**Why GigFlow?**
- Sales teams waste time on messy Excel sheets
- No visibility into team performance
- No role-based access — everyone sees everything

GigFlow solves this by providing a clean dashboard where admins see everything and sales users only see their own leads.

## 🔗 Live Demo
- **Frontend:** https://gigflow-livid-seven.vercel.app
- **Backend API:** https://gigflow-gcqo.onrender.com/health

## 👤 Test Credentials
- **Admin:** admin@gigflow.com / admin123
- **Sales:** sales@gigflow.com / sales123
  
## 🚀 Tech Stack

- **Frontend:** React.js, TypeScript, TailwindCSS, Recharts
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Other:** Docker, React Hook Form, Axios

## ✨ Features

- JWT Authentication (Register/Login)
- Role Based Access Control (Admin/Sales)
- Leads CRUD (Create, Read, Update, Delete)
- Advanced Filtering (Status, Source, Search, Sort)
- Debounced Search
- Backend Pagination (10 per page)
- CSV Export
- Dashboard Charts (Pie + Bar)
- Dark Mode
- Responsive Design

## 🔐 Roles

| Feature | Admin | Sales |
|---------|-------|-------|
| View all leads | ✅ | ❌ Own only |
| Delete leads | ✅ | ❌ |
| Charts | All data | Own data |

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

## 🌐 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
## 🗄️ Database Schema

### User
- name, email, password (hashed), role (admin/sales), createdAt

### Lead  
- name, email, status (New/Contacted/Qualified/Lost), source (Website/Instagram/Referral), createdBy (ref: User), createdAt

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |

### Leads
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/leads | Get all leads with filters | Private |
| POST | /api/leads | Create lead | Private |
| GET | /api/leads/:id | Get single lead | Private |
| PUT | /api/leads/:id | Update lead | Private |
| DELETE | /api/leads/:id | Delete lead | Admin only |
| GET | /api/leads/stats | Dashboard stats | Private |
| GET | /api/leads/export | Export CSV | Private |
