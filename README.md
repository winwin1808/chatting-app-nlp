## Project Structure for Chatting Application (NLP)

### Overview

The project is structured into two main parts: the frontend and the backend. The frontend is built using React, while the backend is developed using Node.js with Express. The application facilitates real-time communication between users and admin agents, integrates sentiment analysis using FastAPI and BERT, and provides comprehensive reporting features.

### Frontend Structure

The frontend is located in the `public` directory, organized as follows:

```
public/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- context/
|   |-- pages/
|   |-- services/
|   |-- utils/
|   |-- App.js
|   |-- authLayout.js
|   |-- index.css
|   |-- index.js
|   |-- mainLayout.js
|-- .env example
|-- .gitignore
|-- package-lock.json
|-- package.json
|-- README.md
```

- **assets/**: Contains images, icons, and other static assets.
- **components/**: Contains reusable React components.
- **context/**: Manages the global state using React Context API.
- **pages/**: Contains the main pages for the application.
- **services/**: Handles API calls and other service functions.
- **utils/**: Utility functions and helpers.

### Backend Structure

The backend is located in the `server` directory, organized as follows:

```
server/
|-- config/
|-- controllers/
|-- middleware/
|-- models/
|-- routes/
|-- scripts/
|-- utils/
|-- .env
|-- .env example
|-- app.js
|-- package-lock.json
|-- package.json
|-- server.js
|-- vercel.json
```

- **config/**: Configuration files, such as database connections.
- **controllers/**: Controllers to handle the business logic.
- **middleware/**: Middleware functions for request processing.
- **models/**: Mongoose models for MongoDB collections.
- **routes/**: API routes.
- **scripts/**: Additional scripts for tasks like data seeding.
- **utils/**: Utility functions and helpers.

### Features

#### Chat Functionality
- **Real-time Messaging**: Facilitates real-time communication between users and admin agents using Socket.io.
- **Rating and Feedback**: Allows users to rate their experience and provide feedback after a chat session.
- **Comprehensive Reporting**: Provides detailed performance reports and rating summaries.

#### Sentiment Analysis
- **Model Implementation**: Integrates a sentiment analysis module using FastAPI and BERT.
- **Real-time Processing**: Analyzes customer feedback in real-time to determine sentiment.

### Setup and Configuration

#### Environment Variables

Backend:
- `DEV_URL`: Development URL.
- `JWT_SECRET`: Secret key for JWT.
- `MONGO_URL`: MongoDB connection string.
- `NODE_ENV`: Environment (development or production).
- `PORT`: Port number.
- `PROD_URL`: Production URL.

Frontend (Application):
- `REACT_APP_PROD_HOST`: Production API host URL.
- `NODE_ENV`: Environment (development or production).
- `REACT_APP_DEV_HOST`: Development API host URL.

Frontend (Widget):
- `REACT_APP_PROD_HOST`: Production API host URL.
- `NODE_ENV`: Environment (development or production).
- `REACT_APP_DEV_HOST`: Development API host URL.

#### System Requirements

VNUK Chatting Application:
- React 18
- NodeJS 20.14
- MongoDB 7.0

VNUK Widget:
[VNUK Widget](https://github.com/winwin1808/vnuk-widget)

VNUK Landing Page:
[VNUK Landing Page](https://github.com/winwin1808/vnukchatting-landing) - You can also change the landing page by yourself

Sentiment Application:
[Sentiment Application](https://github.com/winwin1808/sentiment-analysis-vnukchatting)

#### Installation and Running

1. **Install Dependencies**: Run `npm install` to install the necessary libraries in public and server folders.
2. **Start the Server**: Use `npm start` to start the server in public and server folders.

Configuration:
- **VNUK app chat frontend**: Port 3000
- **VNUK app chat server**: Port 5000
- **VNUK app chat widget server**: Port 3001
- **VNUK landing page**: Port 3002
- **Sentiment Application**: Port 8080

### Conclusion

This project structure and configuration setup ensure a modular and organized approach to developing a real-time interactive chatting application with integrated sentiment analysis. The use of React for the frontend, Node.js for the backend, and FastAPI for the AI components provides a robust and scalable solution for managing real-time communication and customer feedback analysis.

You can check the demo website at [VNUK Chatting Site](https://www.vnukchatting.site/) and find the full documentation at [VNUK Chatting Guide](https://www.vnukchatting.site/guide).