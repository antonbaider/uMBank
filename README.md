
# 💻 MBank Frontend [![Node.js CI](https://github.com/antonbaider/uMBank/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/antonbaider/uMBank/actions/workflows/node.js.yml)[![Frontend Docker Image CI](https://github.com/antonbaider/uMBank/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/antonbaider/uMBank/actions/workflows/docker-image.yml)

This is the frontend of the MBank application, built with Vue.js. It provides the user interface for interacting with the backend of MBank, enabling features such as user authentication, account management, and transaction handling.

---

## 📋 Table of Contents

- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🛠 Requirements

- **Node.js** >= 14.x
- **npm** >= 6.x or **Yarn** >= 1.x

---

## 📂 Project Structure

```
├── public/                # Static files
│   ├── favicon.ico
├── src/
│   ├── assets/            # Images, stylesheets
│   ├── components/        # Reusable Vue components
│   ├── services/          # API services, authentication services
│   ├── views/             # Application pages/views
│   ├── router.js          # Vue Router configuration
│   ├── main.js            # Main JavaScript entry point
│   ├── App.vue            # Root component
│   ├── store.js           # Vuex store (if used)
├── .env.example           # Example environment variables file
├── Dockerfile             # Docker configuration
├── README.md              # Documentation
└── package.json           # Project metadata and dependencies
```

---

## 📥 Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/antonbaider/uMBank.git
   cd uMBank
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 🔧 Environment Variables

Create a `.env` file in the root of the project, and add the following variables:

```plaintext
VITE_API_URL=http://localhost:8080   # Backend API URL
```

For production, replace `localhost` with the actual backend URL.

---

## 🚀 Running the Project

### Development Mode

To run the frontend in development mode with hot reloading, use:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Mode

To build the frontend for production:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

---

### 🐳 Docker

To run the frontend in a Docker container:

1. **Build the Docker image**:
   ```bash
   docker build -t mbank-frontend .
   ```

2. **Run the Docker container**:
   ```bash
   docker run -p 80:80 mbank-frontend
   ```

---

## 🌐 Deployment

To deploy, serve the contents of the `dist` directory on your preferred static file server or platform (e.g., Vercel, Netlify).

---

## 🤝 Contributing

Please ensure all pull requests pass linting and formatting checks, and provide a descriptive commit message.

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.
