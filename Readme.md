 # INVENTREE - Inventory Management System (IMS)

A full-stack inventory management application built with the MERN stack and enhanced with AI-powered product support features. The project helps businesses manage products, users, locations, companies, and inventory insights in a modern web interface.

## Overview

This application combines a React-based frontend, a Node.js/Express backend, and a MongoDB database to provide a practical inventory solution for small to medium-sized businesses. It supports authentication, product CRUD operations, analytics, and AI-generated content such as product descriptions, tags, captions, pricing suggestions, and trending product ideas.

## Key Features

- User registration, login, and protected routes
- Product management with create, read, update, and delete operations
- Company and location management
- Product history tracking
- Analytics dashboard for inventory insights
- AI-powered content generation for product marketing
- Responsive UI built with Tailwind CSS
- Docker and Kubernetes deployment support

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts / Chart.js
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- cookie-parser
- CORS

### AI Integration
- Google Gemini via the Google Generative AI SDK
- Prompt-based generation for:
  - product descriptions
  - SEO tags
  - social captions
  - pricing recommendations
  - trending product ideas

## Project Structure

```text
Inventory-Management-System-MERN-Stack-main/
├── Backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── App.jsx
│   │   └── router.jsx
│   ├── package.json
│   └── vite.config.js
├── gateway/
├── services/
├── k8s/
├── docker-compose.yml
└── Readme.md
```

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance
- Gemini API key (for AI features)

## Installation

1. Clone the repository
   ```bash
   git clone <your-repository-url>
   cd Inventory-Management-System-MERN-Stack-main
   ```

2. Install backend dependencies
   ```bash
   cd Backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../Frontend
   npm install
   ```

## Environment Variables

Create a `.env` file in the Backend directory with values similar to:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
ORIGIN=http://localhost:3000
```

For the frontend, create a `.env` file in the Frontend directory if needed:

```env
VITE_SERVER=http://localhost:3000
VITE_MODE=DEV
VITE_LOCAL=http://localhost:3000
```

## Running the Application

### Start the backend
```bash
cd Backend
npm start
```

### Start the frontend
```bash
cd Frontend
npm run dev
```

## API Overview

### Authentication
- POST `/api/v1/users/signup`
- POST `/api/v1/users/login`
- GET `/api/v1/users/logout`

### Products
- GET `/api/v1/products`
- POST `/api/v1/products`
- PUT `/api/v1/products/:id`
- DELETE `/api/v1/products/:id`

### Companies and Locations
- GET/POST `/api/v1/brands`
- GET/POST `/api/v1/location`

### Analytics
- GET `/api/v1/analytics`

### AI Routes
- POST `/api/ai/generate-description`
- POST `/api/ai/generate-tags`
- POST `/api/ai/generate-caption`
- POST `/api/ai/recommend-price`
- POST `/api/ai/trending`

## AI Features

The AI module is built around prompt-based generation using Gemini. It can help users:

- write polished product descriptions
- create SEO-friendly tags
- draft social media captions
- estimate pricing using margin and competitor inputs
- suggest trending product ideas by category

The backend includes graceful fallback logic so that if the AI service is unavailable, the app still returns useful mock responses instead of failing completely.

## Deployment Notes

The repository includes Docker and Kubernetes configuration files for container-based deployment. The structure also suggests a modular service-oriented approach with a gateway and separate service folders.

## License

This project is intended for educational and demonstration purposes. Please review the repository license before commercial use.
