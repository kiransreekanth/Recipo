# Recipo - Recipe Sharing Platform

Recipo is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows users to share and discover recipes.

## Getting Started

Follow the steps below to set up and run the project on your local machine.

---

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (For local database setup) or a MongoDB Atlas cloud database
- [Git](https://git-scm.com/) (For cloning the repository)

---

## Cloning the Repository

```sh
git clone https://github.com/kiransreekanth/Recipo.git
cd Recipo
```

---

## Backend Setup

### 1. Navigate to the backend folder
```sh
cd backend
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure the environment variables
Since the `.env` file is ignored, create a new `.env` file in the `backend` directory and add the following details:

```sh
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```
- Replace `your_mongodb_connection_string` with your actual MongoDB URI.
- Replace `your_secret_key` with a strong secret key for JWT authentication.

### 4. Start the backend server
```sh
npm start
```
This runs the server on `http://localhost:5000`.

---

## Frontend Setup

### 1. Navigate to the frontend folder
```sh
cd ../frontend
```

### 2. Install dependencies
```sh
npm install
```

### 3. Start the frontend application
```sh
npm start
```
This will run the frontend on `http://localhost:3000`.

---

## Accessing the Application
Once both the backend and frontend servers are running:
- Open `http://localhost:3000` in your browser to access the Recipo application.

---

## Notes
- Ensure MongoDB is running locally or you have a valid connection string if using MongoDB Atlas.
- If any issues arise, check logs in the terminal for error messages.
- Make sure the backend is running before accessing the frontend.



