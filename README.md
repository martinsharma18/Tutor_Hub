# TuitionPlatform - Comprehensive Tutoring Solution

TuitionPlatform is a professional, full-stack application designed to bridge the gap between parents/students and qualified tutors. It provides a centralized marketplace for finding, applying for, and managing tutoring sessions, complete with integrated messaging and payment functionalities.

---

## 🌟 Key Features

- **User Profiles**: Distinct profile systems for **Teachers**, **Parents**, and **Admins**.
- **Tuition Listings**: Students or parents can post their specific requirements for tutors.
- **Tutor Applications**: Teachers can browse postings and apply to them directly.
- **Featured Tutors**: A curated section for high-performing teachers to gain more visibility.
- **In-App Messaging**: Seamless communication between teachers and students/parents.
- **Secure Authentication**: JWT-based login and role management for data security.
- **Payment Integration**: Streamlined payment processing for tutoring services.
- **Demo Requests**: Facility for students to request trial sessions before committing.
- **Admin Dashboard**: Comprehensive control panel for managing the platform's core settings (e.g., banner messages, branding).

---

## 🛠️ Technological Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API)
- **Database**: PostgreSQL (Persistence via Entity Framework Core)
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit & React Query (TanStack)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios

---

## 📂 Project Structure

### Backend (`/backend/src`)
- `TuitionPlatform.Domain`: The core of the system, containing business entities, enums, and repository interfaces.
- `TuitionPlatform.Application`: Business logic, services, commands (Mediator pattern), and use-case implementations.
- `TuitionPlatform.Infrastructure`: Data persistence, migrations, and implementation of external services.
- `TuitionPlatform.Api`: The entry point with RESTful controllers, middleware, and dependency injection setup.

### Frontend (`/frontend/src`)
- Modern React architecture utilizing hooks for local state and Redux for global application state.
- Component-driven design with modular, reusable UI parts.
- Tailwind CSS for a consistent and professional aesthetic.

---

## 🚀 Getting Started

To run the project locally, you will need:
1.  **.NET 8 SDK**
2.  **Node.js** (LTS recommended)
3.  **PostgreSQL** instance

For the backend:
`dotnet run --project backend/src/TuitionPlatform.Api`

For the frontend:
`cd frontend && npm install && npm run dev`

---

## 🤝 Contributing

This project reflects a commitment to clean code and robust architectural standards. Contributions aimed at improving these aspects or adding new features are always welcome.

---

*Project created for educational and professional demonstration purposes.*
