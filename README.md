
# PeerPop 🎓🧠  
**AI-powered Skill Analytics and Recommendation Platform**

PeerPop is a full-stack AI-enhanced application that helps users discover in-demand skills, analyze popularity trends, and receive personalized skill recommendations based on historical data and behavior. It is designed to be a collaborative learning platform that empowers learners with data-driven insights.

---

## 🚀 Features

- **Skill Dashboard Visualization**: Explore trending skills across users and visualize patterns using interactive charts.
- **User Management System**: Secure login/signup with JWT-based authentication and session handling.
- **AI-based Skill Recommendations**: Intelligent backend logic to suggest related skills for users based on popularity and usage.
- **MongoDB Data Storage**: Flexible and scalable NoSQL backend to store user profiles, skills, and preferences.
- **Modular Architecture**: Clean separation of backend and frontend code, easily maintainable and extensible.

---

## 🗂 Folder Structure

```
PeerPopNew/
├── backend/         # Node.js + Express backend API
│   ├── controller/  # Route handlers
│   ├── middleware/  # Auth middleware, error handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic, recommendation engine
│   ├── test/        # Unit tests
│   └── app.js       # Main app entry point
│
├── frontend/        # React + Vite frontend UI
│   ├── src/         # React components, pages, context
│   ├── public/      # Static files
│   ├── index.html   # Main HTML file
│   └── vite.config.js
```

---

## 🛠 Tech Stack

### Frontend:
- **React** (with Vite bundler for fast development)
- **Chart.js** – for skill popularity bar/line charts
- **Tailwind CSS** or basic CSS (for styling)
- **Axios** – for handling HTTP requests
- **React Router** – for client-side routing

### Backend:
- **Node.js + Express.js** – REST API
- **MongoDB + Mongoose** – Document-based data storage
- **JWT** – Secure token-based authentication
- **bcrypt** – Password hashing
- **dotenv** – For managing environment variables

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PeerPopNew.git
cd PeerPopNew
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Create a .env file and configure it
npm start             # Starts the backend server at http://localhost:5000
```

**Required `.env` variables:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/peerpop
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev           # Runs the React app on http://localhost:5173
```

---

## 🧪 Testing

- API routes can be tested using **Postman** or **Thunder Client**
- Basic unit tests for backend logic are available in the `/backend/test/` folder

---

## 💡 Example Use Cases

- A student trying to explore most popular skills among peers
- A mentor recommending trending or complementary skills
- A developer visualizing skill adoption over time

---

## 👥 Contributors

- **Anuskha Iytha**
- **Divyansh Nigam**
- **Dhanya Vasantha**
- **Pallavi Vegesana**

---

