# 💰 Backend Ledger System

A robust and secure **RESTful backend API** for managing financial accounts and transactions. Built with **Node.js**, **Express.js**, and **MongoDB**, featuring JWT-based authentication and a clean MVC architecture.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure user registration and login
- 🏦 **Multi-Account Management** — Create and manage multiple financial accounts per user
- 💳 **Transaction Tracking** — Record and retrieve financial transactions
- 📊 **Real-time Balance Calculation** — Get live account balance at any time
- 📧 **Email Notifications** — Nodemailer integration for registration and alerts
- 🏗️ **MVC Architecture** — Clean, scalable, and maintainable code structure
- ✅ **Health Check Route** — Monitor service status easily

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework & REST API |
| **MongoDB** | NoSQL Database |
| **Mongoose** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Authentication & Authorization |
| **Nodemailer** | Email notifications |
| **bcrypt** | Password hashing |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
Backend-Ledger-System/
├── src/
│   ├── controllers/        # Request/response logic
│   │   ├── account.controller.js
│   │   ├── transaction.controller.js
│   │   └── user.controller.js
│   ├── models/             # Mongoose schemas
│   │   ├── account.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/             # API route definitions
│   ├── middlewares/        # JWT auth middleware
│   └── utils/              # Helper functions
├── server.js               # Entry point
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Krissh-stack/Backend-Ledger-System.git
cd Backend-Ledger-System
```

**2. Install dependencies**
```bash
npm install
```

**3. Create a `.env` file in the root directory**
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**4. Start the server**
```bash
npm start
```

The server will run at `http://localhost:3000` 🚀

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### 🏦 Accounts
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts` | Create a new account |
| GET | `/api/accounts` | Get all user accounts |
| GET | `/api/accounts/:accountId/balance` | Get account balance |

### 💳 Transactions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transactions` | Create a new transaction |
| GET | `/api/transactions/:accountId` | Get transactions by account |

### ❤️ Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check service status |

---

## 🔒 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. After logging in, include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🧠 Key Concepts Demonstrated

- **REST API Design** — Proper use of HTTP methods and status codes
- **MVC Pattern** — Separation of concerns across models, views, and controllers
- **JWT Security** — Stateless authentication with token-based authorization
- **MongoDB + Mongoose** — Schema design and database operations
- **Async/Await** — Modern JavaScript asynchronous programming
- **Error Handling** — Graceful error responses across all endpoints

---

## 👨‍💻 Author

**Krishnam Kesarwani**
- GitHub: [@Krissh-stack](https://github.com/Krissh-stack)
- Email: krishnamkesarwani2@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ If you found this project helpful, please give it a star!
