# 🏟️ Kickoff Arena

![Kickoff Arena Banner](./public/readme-assets/banner.png)

## ⚽ The Most Advanced Football Career Simulation

**Kickoff Arena** is a premium, high-performance football management simulation designed for the modern manager. Step into the elite world of global football, where every tactical decision, transfer move, and formation tweak determines your path to glory.

Built with a state-of-the-art tech stack, Kickoff Arena offers a seamless, real-time experience that bridges the gap between traditional management games and live-action simulation.

---

## 🌟 Key Features

### 🏆 Elite Leagues & Global Reach
Dominate the world's most prestigious competitions. From the high intensity of the **Premier League** and the technical mastery of **La Liga** to 8 other elite global leagues, the stage is yours.

### 👤 Legendary Icon System
Forge your legacy with a roster of over **350+ elite players**. Our unique system integrates current superstars with legendary icons like **Pelé, Maradona, Messi, and Ronaldo**, each with historic peak ratings and iconic specialist skills.

### ⚔️ Tactical Superiority
Experience deep tactical control. Choose from various formations (4-3-3, 4-2-3-1, 3-5-2, etc.), define player roles, set-piece strategies, and team mentalities. Your tactical adjustments happen in real-time, allowing you to exploit opponent weaknesses on the fly.

### 🧠 AI-Driven Match Engine
Witness your strategies come to life with our advanced **AI-Driven Match Simulation**. Players make intelligent decisions based on their stats, your tactics, and the dynamic state of the match.

### 🧤 AI Goalkeeper Challenge (Penalty Shootout)
Take on the ultimate test of nerves. Our specialized Penalty Shootout engine uses **Large Language Models (LLM)** via OpenRouter to power an intelligent AI goalkeeper. The keeper analyzes your shooting history and style to predict your next move, providing real-time dramatic commentary in the heat of the moment.

### 📈 Economic Mastery
Manage more than just the pitch. Our comprehensive **Budget & Finance system** tracks your club's economic health. Handle multi-million euro transfers, manage wage bills, and build a sustainable dynasty.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router, Client-side Transitions)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS for premium HUD effects.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Engine:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security:** [JWT](https://jwt.io/) (JSON Web Tokens) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **State Management:** Custom React Context API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kickoff-arena.git
   cd kickoff-arena
   ```

2. **Install dependencies (Root, Client, and Server):**
   ```bash
   npm install
   # This will install root dependencies. Concurrently will manage the rest.
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Launch the Arena:**
   Run the development server from the root directory:
   ```bash
   npm run dev
   ```
   This command uses `concurrently` to launch both the **Express Backend (Port 5000)** and the **Next.js Frontend (Port 3000)**.

---

## 📂 Project Structure

```text
kickoff-arena/
├── footballverse/      # Next.js Frontend (The UI/UX Core)
│   ├── app/            # App Router (Pages, Formations, Squad, Transfers)
│   ├── components/     # Reusable UI Components
│   └── context/         # Auth & Global State
├── server/             # Node.js/Express Backend (The Logic Core)
│   ├── routes/         # API Endpoints (Auth, Matches, transfers)
│   ├── models/         # MongoDB Schemas (User, Player, Squad)
│   └── utils/          # Valuation & Calculation Logic
└── public/             # Static Assets
```

---

## 🎨 Design Philosophy
Kickoff Arena focuses on a **"HUD-First"** design aesthetic—vibrant glows, glassmorphism, and smooth transitions that make you feel like you're in a high-tech football command center.

---

## 📄 License
This project is licensed under the ISC License.

---

*“Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do.” - Pelé*

Developed with ⚽ by Chahel
