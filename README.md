# Personal Developer Portfolio

A full-stack developer portfolio built to showcase my projects, technical skills, development experience, and learning journey.

The portfolio is designed not only as a personal profile website, but also as a place where visitors can explore my projects and understand how they were built, including their features, technologies, architecture, and implementation details.

## 🚀 Features

- Developer profile and introduction
- About Me section
- Project showcase
- Detailed project documentation
- Project features and technology information
- Project architecture and implementation details
- User registration and login
- Email verification
- JWT-based authentication
- Secure password hashing with Argon2
- Protected authenticated areas
- React-based frontend
- FastAPI-based backend
- MySQL database integration
- SQLAlchemy ORM
- CORS configuration
- Responsive user interface

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- HTML
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy

### Database
- MySQL

### Authentication & Security
- JWT Authentication
- Argon2 Password Hashing
- Email Verification
- Protected Routes
- CORS

## 🏗️ Architecture

```text
                    React Frontend
                         │
                         │ HTTP Requests
                         ▼
                  FastAPI Backend
                         │
             ┌───────────┴───────────┐
             │                       │
      Authentication            Application
             │                       │
             └───────────┬───────────┘
                         │
                    SQLAlchemy
                         │
                         ▼
                    MySQL Database
