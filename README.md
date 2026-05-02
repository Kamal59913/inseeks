<div align="center">
  <img src="https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png" alt="Inseeks Logo" width="120" />
  <h1>Inseeks</h1>
  <p><strong>A Modern, Feature-Rich Social Platform and Community Hub</strong></p>

  [![React](https://img.shields.io/badge/React-18.2-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br/>

## ✨ About Inseeks

Inseeks is a comprehensive, full-stack social networking application designed for modern communities. It features real-time interactions, customizable "Spaces" (environments) for niche communities, and rich multimedia posting capabilities (images, videos, and formatted blogs). 

Built with scalability and user experience in mind, Inseeks utilizes a robust React/TypeScript frontend powered by an Express/Node.js backend, with MongoDB handling complex relational and document data.

## 🚀 Key Features

*   **Dynamic Feeds:** Responsive, algorithm-ready post feeds supporting 2-column masonry layouts and infinite scrolling.
*   **Multimedia Posts:** Create, share, and interact with text blogs, image galleries, and video content.
*   **Community Spaces:** Join targeted "Environments" to share and consume niche content.
*   **Real-time Interactions:** WebSocket-powered connections for immediate feedback on votes, comments, and messages.
*   **Advanced Authentication:** Secure JWT-based auth with OTP email verification, secure password resets, and robust session management.
*   **Cloud Integrations:** AWS S3 and Cloudinary integration for scalable media storage and optimized delivery.
*   **Responsive Design:** Fully fluid UI crafted with Tailwind CSS, featuring glassmorphism, dynamic dark modes, and modern typography.

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React (Vite/CRA) with TypeScript
*   **State Management:** Redux Toolkit & React Query (TanStack Query)
*   **Styling:** Tailwind CSS & SASS
*   **Form Handling:** React Hook Form with Zod validation
*   **Routing:** React Router DOM v6

### Backend
*   **Server:** Node.js with Express.js (TypeScript)
*   **Database:** MongoDB via Mongoose
*   **Authentication:** JWT, bcrypt, and OTP generation
*   **Media Handling:** Multer, Sharp, AWS S3, Cloudinary
*   **Emails:** Nodemailer & Handlebars templates

## 📂 Project Structure

```
inseeks/
├── backend/               # Express.js REST API & WebSocket Server
│   ├── src/
│   │   ├── controllers/   # Request handlers & business logic
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API route definitions
│   │   └── validations/   # Request payload validation
│   └── package.json
└── frontend/              # React Client Application
    ├── src/
    │   ├── Components/    # Reusable UI components & Pages
    │   ├── hooks/         # Custom React hooks (React Query integrations)
    │   ├── services/      # Axios API service layer
    │   ├── store/         # Redux state slices
    │   └── validations/   # Frontend Zod schemas
    └── package.json
```

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Cloudinary & AWS S3 Credentials (for media uploads)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/inseeks.git
    cd inseeks
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Environment Configuration:**
    Create a `.env` file in both the `backend` and `frontend` directories using the provided `.env.example` templates. 

5.  **Run the Application (Development):**
    Open two terminals:
    
    *Terminal 1 (Backend):*
    ```bash
    cd backend
    npm run dev
    ```
    
    *Terminal 2 (Frontend):*
    ```bash
    cd frontend
    npm run dev
    ```

## 🔒 Security Note
This project adheres to modern security practices. API keys, database URIs, and JWT secrets are managed via environment variables and are **not** tracked in version control. If deploying this project, ensure all sensitive variables are securely injected into your production environment.

---
<div align="center">
  <i>Designed and developed as a showcase of modern full-stack engineering.</i>
</div>
