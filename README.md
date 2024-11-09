
# 🏦 BankApp Dashboard

Welcome to **BankApp**, a user-friendly banking dashboard to manage transactions, view account balances, track monthly expenses, and visualize recent deposits. This application provides an intuitive interface and interactive charts for a seamless experience.

---

## 📋 Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Endpoints](#api-endpoints)
5. [Project Structure](#project-structure)
6. [Technologies Used](#technologies-used)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

---

## ✨ Features

- **Total Balance Overview** 📊  
  Check your total balance across multiple currencies.

- **Monthly Expenses** 💸  
  Monitor your monthly spending in real-time.

- **Recent Deposits** 💵  
  Visualize your recent deposits with a dedicated chart.

- **Transaction History** 📜  
  View all transactions, including descriptions, amounts, and timestamps.

- **Masked Account Numbers** 🔒  
  Toggle account number visibility for added security.

---

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/bankapp.git](https://github.com/antonbaider/uMBank.git)
   ```

2. **Navigate to the project directory:**
   ```bash
   cd bankapp
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the application:**
   ```bash
   npm run serve
   ```

5. **Access the app:**
   - Visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🛠️ Usage

- **Login/Register:** Create an account or log in to access the dashboard.
- **View Dashboard:** Check total balances, expenses, and deposits.
- **Account Management:** View accounts with masked card numbers. Click on a number to reveal it.
- **Transaction History:** See a detailed breakdown of your recent transactions, including expenses and deposits.

---

## 🔗 API Endpoints

| Endpoint                            | Method | Description                        |
|-------------------------------------|--------|------------------------------------|
| `/api/auth/register`                | POST   | Register a new user                |
| `/api/auth/login`                   | POST   | Log in to the application          |
| `/api/accounts`                     | GET    | Retrieve user account details      |
| `/api/transactions`                 | GET    | Get transaction history            |
| `/api/transactions/transferByCard`  | POST   | Transfer funds by card             |

---

## 📁 Project Structure

```
├── src
│   ├── assets          # Static files (images, icons)
│   ├── components      # Reusable Vue components
│   ├── views           # Application pages (Dashboard, Accounts)
│   ├── services        # API calls and services
│   ├── store           # Vuex store for state management
│   └── App.vue         # Main application component
├── public              # Public assets (favicon, index.html)
└── README.md           # Documentation file
```

---

## 🧰 Technologies Used

- **Frontend Framework:** Vue.js 🌐
- **State Management:** Vuex 🗄️
- **API Communication:** Axios 📡
- **UI Components:** Chart.js 📈, FontAwesome Icons 🎨

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository** 🍴
2. **Create a new branch** 🔀
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Make your changes** 💡
4. **Commit and push your code** 🚀
   ```bash
   git commit -m "Add feature"
   git push origin feature/your-feature
   ```
5. **Create a pull request** 📝

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> Built with ❤️ by Anton
