# 🎓 Student Tracker Backend

A secure backend for the **Student Tracker** web application built with **Node.js**, **Express.js**, and **MySQL**. It provides authentication, user management, and profile APIs for students, teachers, and administrators.

---

## 🚀 Features

- User Registration
- Secure Login Authentication
- Password Hashing using bcrypt
- JWT Authentication
- Role-Based Access (Student, Teacher, Admin)
- Admin Access Code Verification
- User Profile Management
- MySQL Database Integration
- RESTful API

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL
- bcrypt
- JSON Web Token (JWT)
- dotenv
- CORS

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   └── userRoutes.js
├── .env
├── package.json
└── server.js
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to Backend Folder

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file and add:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_tracker
PORT=5000
ADMIN_ACCESS_CODE=ADMIN123
JWT_SECRET=your_secret_key
```

### 5. Start the Server

```bash
npm start
```

or

```bash
node server.js
```

The server will start at:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |

### User Profile

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/profile/:id` | Get user profile |
| PUT | `/api/profile/:id` | Update user profile |

---

## 👤 User Roles

- Student
- Teacher
- Admin

> Admin registration requires a valid **Admin Access Code**.

---

## 🗄️ Database

Database: **MySQL**

Table:

- users

The application stores:

- User ID
- Full Name
- Email
- Password (Hashed)
- Role
- Department
- Contact Information
- Other Profile Details

---

## 🔒 Security Features

- Passwords hashed using bcrypt
- JWT-based Authentication
- Environment Variables using dotenv
- Admin Access Code Validation

---

## 📦 Dependencies

- express
- mysql2
- bcrypt
- jsonwebtoken
- dotenv
- cors

---

## 👨‍💻 Developed By

**Kashif Ahmad Abdul Jahangir**

Computer Engineering Student  
Keystone School of Engineering, Pune
