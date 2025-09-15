# AI Ticket Assistant - Backend API

A Node.js/Express backend API for an AI-powered ticket management system with automated workflows and intelligent assistance.

## 🚀 Features

- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Ticket Management** - CRUD operations for support tickets
- **AI Integration** - Automated ticket analysis and assistance
- **Event-Driven Architecture** - Inngest-powered background jobs
- **Email Notifications** - Automated email workflows
- **MongoDB Integration** - Mongoose ODM for data persistence

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Background Jobs**: Inngest
- **Email**: Nodemailer
- **Development**: Nodemon

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Installation

```bash
cd ai-ticket-assistant
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-ticket-system
JWT_SECRET=your-super-secret-jwt-key
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# AI Configuration (if using external AI services)
OPENAI_API_KEY=your-openai-api-key
```

### 3. Development

```bash
# Start the main server
npm run dev

# Start Inngest development server (in separate terminal)
npm run inngest-dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}
```

#### POST `/api/auth/login`
Authenticate user
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Ticket Endpoints

All ticket endpoints require authentication (Bearer token in Authorization header).

#### GET `/api/tickets`
Retrieve all tickets for authenticated user

#### GET `/api/tickets/:id`
Retrieve specific ticket by ID

#### POST `/api/tickets`
Create a new ticket
```json
{
  "title": "Login Issue",
  "description": "Unable to login to the system",
  "priority": "high",
  "deadline": "2024-01-15T10:00:00Z"
}
```

### Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🏗️ Project Structure

```
ai-ticket-assistant/
├── controllers/          # Request handlers
│   ├── ticket.js        # Ticket CRUD operations
│   └── user.js          # User authentication
├── inngest/             # Background job functions
│   ├── functions/       # Inngest function definitions
│   └── client.js        # Inngest client configuration
├── middlewares/         # Express middlewares
│   └── auth.js          # JWT authentication middleware
├── models/              # Mongoose schemas
│   ├── ticket.js        # Ticket data model
│   └── user.js          # User data model
├── routes/              # Express route definitions
│   ├── ticket.js        # Ticket routes
│   └── user.js          # User routes
├── utils/               # Utility functions
│   ├── ai.js            # AI integration helpers
│   └── mailer.js        # Email utilities
├── index.js             # Application entry point
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### Database Models

#### User Schema
- `name`: String - User's full name
- `email`: String - Unique email address
- `password`: String - Hashed password
- `role`: String - User role (user/admin)
- `createdAt`: Date - Account creation timestamp

#### Ticket Schema
- `title`: String - Ticket title
- `description`: String - Detailed description
- `status`: String - Current status (TODO/IN_PROGRESS/DONE)
- `createdBy`: ObjectId - Reference to User
- `assignedTo`: ObjectId - Reference to assigned User
- `priority`: String - Priority level
- `deadline`: Date - Due date
- `helpfulNotes`: String - AI-generated assistance
- `relatedSkills`: [String] - Required skills array
- `createdAt`: Date - Creation timestamp

### Inngest Functions

The system includes automated workflows:

- **onUserSignup**: Sends welcome email when user registers
- **onTicketCreated**: Analyzes ticket and generates AI assistance

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Request data validation
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Production Environment

1. Set production environment variables
2. Use process manager (PM2 recommended):

```bash
npm install -g pm2
pm2 start index.js --name "ai-ticket-api"
```

3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure MongoDB replica set for production

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

## 🧪 Testing

```bash
# Run test suite
npm test

# Test specific endpoint
node test.js
```

## 📝 Development Guidelines

- Use ES6+ features and modules
- Follow RESTful API conventions
- Implement proper error handling
- Add JSDoc comments for functions
- Use meaningful commit messages
- Test endpoints before deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Note**: Ensure all environment variables are properly configured before running the application.