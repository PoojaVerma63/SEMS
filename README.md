# SEMS – Smart Employee Management System

SEMS (Smart Employee Management System) is a full-stack web application built using **ASP.NET Core Web API** and **Angular**. The application provides a structured platform for managing employee-related operations through a modern web interface and RESTful APIs.

## 🚀 Project Overview

SEMS is designed with a separate frontend and backend architecture:

* **Frontend:** Angular
* **Backend:** ASP.NET Core Web API
* **Database:** SQL Server
* **Authentication:** JWT-based authentication
* **API Documentation:** Swagger / OpenAPI
* **CI/CD:** GitHub Actions
* **Cloud:** Microsoft Azure

## 🏗️ Project Structure

```text
SEMS/
│
├── SEMS.API/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   └── Program.cs
│
├── sems-client/
│   ├── src/
│   │   └── app/
│   ├── package.json
│   └── angular.json
│
├── .github/
│   └── workflows/
│       ├── dotnet-ci.yml
│       └── angular-ci.yml
│
└── README.md
```

## 🛠️ Technologies Used

### Backend

* C#
* ASP.NET Core Web API
* .NET 9
* Entity Framework Core
* SQL Server
* LINQ
* JWT Authentication
* Swagger / OpenAPI

### Frontend

* Angular
* TypeScript
* HTML5
* CSS
* Bootstrap
* SweetAlert2

### DevOps / Cloud

* Git
* GitHub
* GitHub Actions
* CI/CD
* Microsoft Azure

## ✨ Key Features

* Employee management
* Employee CRUD operations
* RESTful Web APIs
* Angular-based user interface
* Authentication and authorization
* JWT-based security
* SQL Server database integration
* API documentation with Swagger
* Responsive frontend
* Separation of frontend and backend
* Automated CI using GitHub Actions
* Azure deployment support

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration.

### .NET CI

```text
Git Push
   ↓
GitHub Actions
   ↓
Checkout Code
   ↓
Setup .NET
   ↓
Restore Dependencies
   ↓
Build .NET API
```

Workflow:

```text
.github/workflows/dotnet-ci.yml
```

### Angular CI

```text
Git Push
   ↓
GitHub Actions
   ↓
Checkout Code
   ↓
Setup Node.js 22
   ↓
npm ci
   ↓
npm run build
```

Workflow:

```text
.github/workflows/angular-ci.yml
```

Both frontend and backend builds are automatically validated through GitHub Actions.

## 💻 Local Setup

### Prerequisites

Make sure the following are installed:

* .NET SDK 9
* Node.js 22+
* npm
* SQL Server
* Git
* Visual Studio / VS Code

### Clone Repository

```bash
git clone https://github.com/PoojaVerma63/SEMS.git
```

```bash
cd SEMS
```

## ▶️ Run Backend

Navigate to the API project:

```bash
cd SEMS.API
```

Restore dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run
```

The API can then be accessed through the configured local URL.

Swagger is available at:

```text
/swagger
```

## ▶️ Run Angular Frontend

Open another terminal:

```bash
cd sems-client
```

Install dependencies:

```bash
npm ci
```

Run Angular:

```bash
npm start
```

The application will be available at the local Angular development URL shown in the terminal.

## 🗄️ Database

The application uses **Microsoft SQL Server**.

Update the database connection string in the backend configuration according to your local environment.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING"
  }
}
```

> Do not commit production passwords, API keys, connection strings, JWT secrets, or other sensitive credentials to GitHub.

## 🔐 Authentication

The API uses JWT-based authentication.

Typical flow:

```text
User Login
    ↓
API Authentication
    ↓
JWT Token
    ↓
Authorization
    ↓
Protected API Endpoints
```

## ☁️ Azure Deployment

The application is designed to support deployment to **Microsoft Azure**.

The intended deployment pipeline is:

```text
Developer
    ↓
git push origin main
    ↓
GitHub
    ↓
GitHub Actions
    ↓
.NET Build + Test
    ↓
Angular Build
    ↓
Publish
    ↓
Azure
    ↓
Live Application
```

## 📁 GitHub Actions

CI workflows are located in:

```text
.github/workflows/
```

### Backend CI

```text
.github/workflows/dotnet-ci.yml
```

### Frontend CI

```text
.github/workflows/angular-ci.yml
```

## 🧪 Build Verification

Backend:

```bash
dotnet build --configuration Release
```

Frontend:

```bash
npm run build
```

Successful GitHub Actions runs verify that the application can be built in the CI environment.

## 📌 Development Workflow

Typical development workflow:

```text
Create / Update Feature
        ↓
Test Locally
        ↓
git add .
        ↓
git commit -m "Your commit message"
        ↓
git push origin main
        ↓
GitHub Actions
        ↓
Build & Validate
        ↓
Deploy to Azure
```

## 🔮 Future Improvements

* Automated unit and integration tests
* Automated production deployment
* Environment-specific configuration
* Docker containerization
* Azure monitoring and logging
* Code quality and security scanning
* Database migration automation

## 👩‍💻 Author

**Pooja Verma**

.NET Developer | ASP.NET Core | Web API | Angular | SQL Server

GitHub:
https://github.com/PoojaVerma63

---

## 📄 License

This project is intended for learning, development, and portfolio purposes.
