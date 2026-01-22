# Butic V2 - Full Stack Application

A modern full-stack application built with Express.js backend and React frontend using Vite for fast development and optimized builds.

## Project Structure

```
server/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/               # React source code
│   └── package.json       # Frontend dependencies
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md              # This file
```

## Features

- **Express.js Backend**: RESTful API with middleware support
- **React Frontend**: Modern UI with responsive design
- **Vite Bundler**: Lightning-fast development and optimized production builds
- **API Integration**: Frontend communicates with backend via API calls
- **Development Ready**: Hot module replacement and fast development server
- **Production Ready**: Optimized build scripts and deployment configuration

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install server dependencies:
```bash
cd server
npm install
```

2. Install client dependencies:
```bash
npm run install-client
```

### Development

1. Start the development server:
```bash
npm run dev
```

This will start the Express server on port 5001 with nodemon for auto-restart.

2. In a separate terminal, start the Vite development server:
```bash
cd client
npm run dev
```

The React app will be available at `http://localhost:3000` and will proxy API requests to the Express server on port 5001.

### Production Build

1. Build the React app:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The application will be available at `http://localhost:5001`.

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/hello` - Sample API endpoint

## Environment Variables

Create a `.env` file in the server directory with the following content:

```
PORT=5001
NODE_ENV=development
```

**To create the .env file:**
```bash
cd server
echo "PORT=5001" > .env
echo "NODE_ENV=development" >> .env
```

Or manually create the file with your preferred text editor.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run dev-client` - Start Vite development server
- `npm run build` - Build React app for production with Vite
- `npm run install-client` - Install client dependencies
- `npm run heroku-postbuild` - Build script for deployment platforms

## Deployment

The application is configured for easy deployment to platforms like Heroku, Vercel, or any Node.js hosting service.

For Heroku deployment:
1. The `heroku-postbuild` script will automatically install client dependencies and build the React app
2. The Express server will serve the built React app in production

## Development Tips

- The React app runs on port 3000 in development and proxies API requests to the Express server on port 5001
- In production, the Express server serves the built React app and handles all requests
- Use `nodemon` for automatic server restarts during development
- Vite provides lightning-fast hot module replacement for instant updates
- The client has a proxy configuration to avoid CORS issues during development
- Vite builds are optimized and much faster than Create React App builds
