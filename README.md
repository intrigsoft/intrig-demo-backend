# Intrig Demo Backend

## Description

This repository showcases the capabilities of Intrig through a comprehensive backend API built with NestJS. The application demonstrates modern web development practices including RESTful API design, file upload/download functionality, data validation, and comprehensive API documentation.

### Features

- **Product Management**: Full CRUD operations for products with advanced search and filtering
- **Image Upload/Download**: Support for product image management with file validation
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Data Persistence**: JSON-based database with automatic initialization
- **Validation**: Request/response validation using class-validator
- **TypeScript**: Full TypeScript support for type safety and better development experience

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Build the Project

```bash
# Build for production
npm run build
```

### Start the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Standard development mode
npm run start
```

The application will start on port 5001 by default. You can access it at `http://localhost:5001`.

## API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: [http://localhost:5001/docs](http://localhost:5001/docs) - Interactive API documentation interface
- **OpenAPI JSON**: [http://localhost:5001/swagger.json](http://localhost:5001/swagger.json) - Raw OpenAPI specification in JSON format

The Swagger documentation provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface
- Model definitions
- Authentication requirements (if applicable)

