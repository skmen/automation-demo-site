# 🌐 Automation Demo Site

**A lightweight, purpose-built web application featuring common UI elements and workflows, designed exclusively as a target for test automation practice and framework development.**

---

## 💡 Overview and Purpose

This site is intended to serve as a **stable and predictable environment** for testing various automation frameworks (like Selenium, Cypress, Playwright, etc.). It includes a variety of interactive elements such as login forms, data tables, navigation menus, and form submissions that often challenge automation engineers.

### Website Link
https://skmen.github.io/automation-demo-site/index.html

### Key Features for Automation:

* **Predictable Element IDs/Names:** Elements are designed with clear, stable locators to minimize the frustration of dealing with dynamic IDs.
* **Common Workflows:** Includes standard features like user registration, login/logout, data submission, and display of dynamic content.
* **Minimal Dependencies:** Runs with minimal external services, making local setup quick and reliable.
* **Fault Simulation:** Future versions may include optional endpoints to simulate common failures (e.g., slow response times, 500 errors) for robust error handling practice.

---

## 🛠️ Getting Started

This section provides the fastest way to get the demo application running locally to begin your automation testing.

### Prerequisites

* **Node.js:** Version 16 or higher (as this is likely a Node/JavaScript-based web app).
* **npm or yarn:** A package manager for installing dependencies.

### Installation and Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/skmen/automation-demo-site.git](https://github.com/skmen/automation-demo-site.git)
    cd automation-demo-site
    ```

2.  **Install Dependencies:**
    ```bash
    # Using npm
    npm install
    
    # or using yarn
    yarn install
    ```

3.  **Configuration (Optional):**
    If the site uses environment variables (e.g., for different ports or dummy data), instruct the user to set them up:
    ```bash
    # Create a local .env file based on the example
    cp .env.example .env
    ```
    *The site defaults to running on port 3000.*

### Running the Application

Use the following commands to start the web server.

#### **Development Mode (with live reload):**
```bash
npm run dev
# or 
yarn dev

