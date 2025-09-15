# AI Ticket System - Frontend

A modern React-based frontend application for the AI-powered ticket management system with responsive design and intuitive user experience.

## 🚀 Features

- **Modern React UI** - Built with React 19 and functional components
- **Responsive Design** - TailwindCSS + DaisyUI for beautiful, mobile-first design
- **Protected Routes** - Authentication-based route protection
- **Real-time Updates** - Dynamic ticket status and data updates
- **Markdown Support** - Rich text rendering for ticket descriptions
- **Role-based Access** - Different views for users and administrators
- **Fast Development** - Vite for lightning-fast build and HMR

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS + DaisyUI
- **Routing**: React Router DOM v7
- **Markdown**: React Markdown
- **Linting**: ESLint
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Running backend API server

## ⚡ Quick Start

### 1. Installation

```bash
cd ai-ticket-frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=AI Ticket System
```

### 3. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
ai-ticket-frontend/
├── public/              # Static assets
│   └── vite.svg        # Vite logo
├── src/                # Source code
│   ├── assets/         # Images and static files
│   │   └── react.svg   # React logo
│   ├── components/     # Reusable components
│   │   ├── Check-auth.jsx    # Authentication wrapper
│   │   └── Navbar.jsx        # Navigation component
│   ├── pages/          # Page components
│   │   ├── Admin.jsx         # Admin dashboard
│   │   ├── Dashboard.jsx     # User dashboard
│   │   ├── Layout.jsx        # App layout wrapper
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Registration page
│   │   ├── Ticket.jsx        # Individual ticket view
│   │   └── Tickets.jsx       # Tickets list view
│   ├── index.css       # Global styles
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 📱 Pages & Components

### Pages

#### `/` - Tickets List
- Display all tickets for authenticated user
- Filter and search functionality
- Quick status updates
- Create new ticket button

#### `/tickets/:id` - Ticket Details
- Detailed ticket view
- Edit ticket information
- Status management
- AI-generated helpful notes
- Markdown rendering for descriptions

#### `/login` - Authentication
- User login form
- JWT token management
- Redirect to dashboard after login

#### `/signup` - Registration
- New user registration
- Form validation
- Automatic login after signup

#### `/admin` - Admin Dashboard
- Administrative controls
- User management
- System statistics
- Ticket assignment

#### `/dashboard` - User Dashboard
- Personal ticket overview
- Quick actions
- Statistics and metrics

### Components

#### `CheckAuth`
Authentication wrapper component that:
- Protects routes based on authentication status
- Redirects unauthenticated users to login
- Manages JWT token validation
- Handles route protection logic

#### `Navbar`
Navigation component featuring:
- User authentication status
- Navigation links
- Logout functionality
- Responsive mobile menu

#### `Layout`
App-wide layout wrapper that:
- Provides consistent page structure
- Manages global state
- Handles navigation
- Responsive design container

## 🎨 Styling & Design

### TailwindCSS + DaisyUI

The application uses TailwindCSS for utility-first styling combined with DaisyUI for pre-built components:

```css
/* Example component styling */
.ticket-card {
  @apply card bg-base-100 shadow-xl;
}

.btn-primary {
  @apply btn btn-primary;
}
```

### Responsive Design

- **Mobile-first approach** - Optimized for mobile devices
- **Breakpoint system** - sm, md, lg, xl breakpoints
- **Flexible layouts** - CSS Grid and Flexbox
- **Touch-friendly** - Large tap targets and gestures

### Theme Support

DaisyUI provides multiple themes:
- Light theme (default)
- Dark theme
- Custom theme configurations

## 🔐 Authentication Flow

### Login Process
1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. User redirected to dashboard

### Route Protection
```jsx
<CheckAuth protectedRoute={true}>
  <ProtectedComponent />
</CheckAuth>
```

### Token Management
- Automatic token validation
- Token refresh handling
- Logout functionality
- Session persistence

## 🌐 API Integration

### HTTP Client Configuration

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return response.json();
};
```

### Error Handling

- Network error handling
- API error responses
- User-friendly error messages
- Retry mechanisms

## 🚀 Build & Deployment

### Development Build

```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps
- Development server

### Production Build

```bash
npm run build
```

Optimizations:
- Code splitting
- Tree shaking
- Asset optimization
- Minification

### Deployment Options

#### Static Hosting (Recommended)
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: Deploy `dist` folder

#### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ⚙️ Configuration

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=AI Ticket System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Testing Strategy

- **Component Testing** - React Testing Library
- **Integration Testing** - API integration tests
- **E2E Testing** - Cypress or Playwright
- **Visual Testing** - Storybook integration

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Minimum Versions**: ES2020 support required

## 🔧 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript for type safety (optional)

### Component Structure
```jsx
// Component template
import React from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### State Management
- Use React hooks for local state
- Context API for global state
- Consider Redux Toolkit for complex state

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Follow coding standards
4. Add tests for new features
5. Commit changes (`git commit -m 'Add new feature'`)
6. Push to branch (`git push origin feature/new-feature`)
7. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the component documentation
- Review the API integration guide
- Create an issue in the repository
- Contact the development team

---

**Note**: Ensure the backend API is running before starting the frontend development server.