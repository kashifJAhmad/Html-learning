# 🎓 Student Tracker

A modern **Student Management System** built using **HTML, CSS, JavaScript, Bootstrap, Node.js, Express.js, and MySQL**.

The project provides a professional web interface for managing students, teachers, and administrators with secure authentication and a responsive dashboard.

---

# ✨ Features

## 🌐 Frontend

- Modern Responsive UI
- Professional Landing Page
- Bootstrap 5 Design
- Admin Login
- Admin Dashboard
- User Profile Page
- Responsive Layout
- Clean UI Components

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Admin Access Code Verification
- Role-Based Access Control

## ⚙ Backend

- REST API
- Express.js Server
- MySQL Database
- User Authentication
- Profile Management
- Environment Variable Support

---

# 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5

### Backend

- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- dotenv
- CORS

---

# 📂 Project Structure

```text
Html-learning/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── webportal/
│       ├── Login_form/
│       ├── Register_forms/
│       ├── admin-profile.html
│       └── admin-profile.css
│
└── README.md
```

---

# 🚀 Current Modules

- ✅ Landing Page
- ✅ Admin Registration
- ✅ Admin Login
- ✅ Admin Dashboard
- ✅ Admin Profile
- ✅ Authentication API
- ✅ MySQL Integration

---

# 🚧 Upcoming Modules

- 📚 Student Management
- 👨‍🏫 Teacher Management
- 📅 Attendance System
- 💰 Fee Management
- 📈 Reports & Analytics
- 📊 Dashboard Statistics
- 🔔 Notifications

---

# ⚙ Installation

## 1. Clone Repository

```bash
git clone https://github.com/kashifJAhmad/Html-learning.git
```

---

## 2. Open Project

```bash
cd Html-learning
```

---

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_tracker
PORT=5000
JWT_SECRET=your_secret_key
ADMIN_ACCESS_CODE=ADMIN123
```

---

## 5. Start Backend

```bash
npm start
```

or

```bash
node server.js
```

Server:

```
http://localhost:5000
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/register` |
| POST | `/api/login` |

## Profile

| Method | Endpoint |
|---------|----------|
| GET | `/api/profile/:id` |
| PUT | `/api/profile/:id` |

---

# 🔒 Security

- bcrypt Password Hashing
- JWT Authentication
- Role-Based Authorization
- Environment Variables
- Admin Access Code Validation

---

# 🗄 Database

Database:

```
student_tracker
```

Main Table:

```
users
```

Stores:

- User Information
- Login Credentials
- Roles
- Department
- Contact Details

---

# 👨‍💻 Developer

**Kashif Ahmad Abdul Jahangir**

Computer Engineering Student

Keystone School of Engineering, Pune

---

# ⭐ Future Vision

Student Tracker aims to become a complete college management system with:

- Student Portal
- Teacher Portal
- Attendance Management
- Fees Management
- Reports
- Analytics Dashboard
- Notifications
- Admin Control Panel

---

## ⭐ If you like this project, don't forget to Star the repository!
