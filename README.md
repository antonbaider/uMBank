
# 💻 MBank Frontend [![Node.js CI](https://github.com/antonbaider/uMBank/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/antonbaider/uMBank/actions/workflows/node.js.yml)[![Frontend Docker Image CI](https://github.com/antonbaider/uMBank/actions/workflows/docker-image.yml/badge.svg?branch=main)](https://github.com/antonbaider/uMBank/actions/workflows/docker-image.yml)

This is the frontend of the MBank application, built with Vue.js. It provides the user interface for interacting with the backend of MBank, enabling features such as user authentication, account management, and transaction handling.

# 💻 MBank App Java BackEnd
https://github.com/antonbaider/MBankApp.git
---

## Features
- **User Authentication**: Secure login and registration for users.
- **Account Management**: Open, update, view, and close accounts.
- **Fund Transfers**: Transfer funds between accounts or via card numbers.
- **User Profile Management**: View and update profile information.

---

## Technologies Used
- **Vue.js** for the frontend
- **Axios** for making API requests
- **Postman Collection** for API testing
- **Docker** for containerized deployment

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

## Endpoint Descriptions

Below is a brief description of available endpoints in the API:

### Authentication
- **POST /auth/register** - Register a new user.
- **POST /auth/login** - Log in an existing user.

### User Profile
- **GET /users/profile** - Get user profile details.
- **PUT /users/update** - Update user profile information.

### Accounts
- **POST /accounts** - Open a new account with specified currency.
- **GET /accounts** - Retrieve all accounts for the logged-in user.
- **DELETE /accounts/close** - Close an existing account by card number.

### Transactions
- **POST /transactions/transfer** - Transfer funds between accounts using account IDs.
- **POST /transactions/transferByCard** - Transfer funds between accounts using card numbers.
- **GET /transactions/history** - Get transaction history for the logged-in user.

### Admin
- **POST /admin/adminTransfer** - Perform admin-level fund transfers.

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
