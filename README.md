### Author Name: Cheah Yue Pei 
# CramClub

CramClub is a platform for students to ask questions, share resources, and engage in academic discussions with features like thread categorization, user profiles, voting, and resource sharing.

## Table of Contents
- [Description](#description)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Description
CramClub is built with:
- **Frontend**: React with TypeScript
- **Backend**: Go (Golang)
- **Database**: PostgreSQL
- **ORM**: GORM
- **HTTP Client**: Axios

## Prerequisites
Ensure you have the following installed on your system:
1. [Node.js](https://nodejs.org/) (v16 or higher) and npm
2. [Go](https://golang.org/) (v1.18 or higher)
3. [PostgreSQL](https://www.postgresql.org/)
4. [Git](https://git-scm.com/)

## Setup Instructions
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/JadeCheah/CramClub.git
   ```

### Backend Setup
2. Navigate into the backend directory:
   ```bash
   cd CramClub/backend 
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables **with your own configurations**:
   ```
   # Database configuration
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=cramclub
   DB_PORT=5432
   DB_SSLMODE=disable

   # JWT Secret for authentication
   JWT_SECRET=your_jwt_secret

   # CORS configuration (frontend URL)
   FRONTEND_URL=http://localhost:5173
   ```
4. Install Go dependencies:
   ```bash
   go mod tidy
   ```

### Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd ../frontend 
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

## Running the Application
### Running the Backend 
1. Navigate to the `backend` directory:
   ```bash
   cd backend 
   ```
2. Start the backend server:
   ```bash
   go run main.go 
   ```
### Running the frontend 
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Contact Me 
If you have any questions or need further assistance, feel free to contact me:
1. Email: jadecheah79@gmail.com
2. Telegram Handle: @y9u7e











