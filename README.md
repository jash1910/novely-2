# 📚 Novely – Full Stack Project

**Novely** is a full-stack web application built using the **MERN** stack, focusing on secure and efficient **user authentication**.
It demonstrates modern full-stack development practices with **JWT-based authentication**, **bcrypt password hashing**, and a responsive **React (Vite)** frontend.

---

## 🚀 Project Overview

**Tech Stack**

* **Frontend:** React (Vite) + Axios + CSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB Atlas
* **Authentication:** JWT (JSON Web Token)
* **Password Security:** Bcrypt Hashing

---

## 🌐 Hosted Links

| Component    | Hosting Platform | Live URL                                                                           |
| ------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **Frontend** | Vercel           | [https://frontend-chi-nine-66.vercel.app](https://frontend-chi-nine-66.vercel.app) |
| **Backend**  | Render           | *(To be added after backend deployment)*                                           |
| **Database** | MongoDB Atlas    | Connected                                                                          |

---

## ⚙️ Features

✅ **User Registration** – Secure signup with password hashing using **bcrypt**
✅ **User Login** – JWT-based authentication for protected routes
✅ **Token Verification** – Middleware verifies users before accessing private endpoints
✅ **MongoDB Integration** – Cloud database using **MongoDB Atlas**
✅ **Frontend Integration** – **Axios** for seamless API communication
✅ **Responsive UI** – Simple, clean, and modern CSS-based design
✅ **Error Handling** – Frontend and backend validation with user feedback

---

## 🧠 API Endpoints

| Method | Endpoint      | Description                        |
| ------ | ------------- | ---------------------------------- |
| `POST` | `/api/signup` | Register a new user                |
| `POST` | `/api/login`  | Authenticate user and return token |
| `GET`  | `/api/users`  | Fetch all users (Protected Route)  |

---

## 🔐 Authentication Flow

1. User **signs up** → Password is hashed using **bcrypt** and stored securely in MongoDB
2. On **login** → Credentials validated, a **JWT token** is generated and returned
3. Client stores token in **localStorage/sessionStorage**
4. Access to **protected routes** requires token verification via middleware

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/novely.git
cd novely
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend server:

```bash
node server.js
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)**

---

## 🧾 Example User Flow

1. **Sign Up** → Register with name, email, and password
2. **Login** → Authenticate and receive JWT token
3. **Users Page** → Access secured data using valid token

---

## 🛠️ Deployment

* **Frontend:** Deployed on [Vercel](https://vercel.com)
* **Backend:** Deployed on [Render](https://render.com)
* **Database:** Hosted on **MongoDB Atlas**

---

## 📷 Preview

*(Add screenshots or GIFs here to showcase the app UI)*
Example:

```
frontend/public/screenshots/
 ├── signup.png
 ├── login.png
 └── users.png
```

---

## 💡 Future Enhancements

* Password reset via email
* Role-based access control (Admin/User)
* Profile customization and avatar upload
* Dark/light mode toggle

---
