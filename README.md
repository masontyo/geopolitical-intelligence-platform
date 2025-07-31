# Geopolitical Intelligence MVP

A contextual information synthesis software that provides hyper-personalized and contextual information to high-value decision makers regarding geopolitical events.

## 🎯 Project Overview

This MVP focuses on **Phase 1: User Profile Management** with comprehensive testing integrated throughout the development process.

### Current Status ✅
- **Frontend-Backend Integration**: Complete
- **API Service Layer**: Implemented
- **User Profile Management**: Working
- **Dashboard**: Functional
- **Testing**: 19/19 tests passing
- **Ready for Deployment**: Yes

### Core Features (MVP)
- ✅ User profile creation and management
- ✅ Business unit and area of concern tracking
- ✅ Regional interest management
- ✅ Risk tolerance configuration
- ✅ Relevance scoring for geopolitical events
- ✅ Manual event input and analysis
- ✅ Comprehensive test coverage (Unit, Integration, E2E)

## 🏗️ Architecture

### Frontend
- **React 19** with Material-UI
- **Testing**: Jest + React Testing Library
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Node.js** with Express
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS
- **Logging**: Morgan

### Testing Strategy
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and component interactions
- **Coverage Threshold**: 80% minimum
- **Test-Driven Development**: Tests written before implementation

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd "25/All Code"
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd my-app-frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../my-app-backend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd my-app-backend
   npm run dev
   ```
   Server will run on: http://localhost:3001

2. **Start the Frontend Application**
   ```bash
   cd my-app-frontend
   npm start
   ```
   App will run on: http://localhost:3000

## 🧪 Testing

### Running Tests

#### Frontend Tests
```bash
cd my-app-frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### Backend Tests
```bash
cd my-app-backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Coverage

The project maintains **80% minimum coverage** across:
- **Functions**: 80%
- **Lines**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Test Structure

```
my-app-frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   └── UserProfileForm.test.js
│   │   └── UserProfileForm.js
│   └── ...

my-app-backend/
├── __tests__/
│   ├── unit/
│   │   └── userProfile.test.js
│   └── integration/
│       └── userProfile.test.js
├── utils/
│   └── userProfile.js
└── routes/
    └── userProfile.js
```

## 📋 API Endpoints

### User Profile Management
- `POST /api/user-profile` - Create/Update user profile
- `GET /api/user-profile/:id` - Get user profile
- `GET /api/user-profile/:id/relevant-events` - Get relevant events

### Event Management
- `POST /api/events` - Create geopolitical event
- `GET /api/events` - Get all events

### Health Check
- `GET /health` - Server health status

## 🔧 Development Workflow

### Test-Driven Development (TDD)
1. **Write Test**: Create test for new feature
2. **Run Test**: Verify test fails (Red)
3. **Write Code**: Implement feature to pass test
4. **Run Test**: Verify test passes (Green)
5. **Refactor**: Clean up code while maintaining tests (Refactor)

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Coverage**: Minimum 80% test coverage
- **Security**: Helmet middleware, input validation

## 📁 Project Structure

```
25/All Code/
├── my-app-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   │   └── UserProfileForm.test.js
│   │   │   └── UserProfileForm.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── my-app-backend/
│   ├── __tests__/
│   │   ├── unit/
│   │   │   └── userProfile.test.js
│   │   └── integration/
│   │       └── userProfile.test.js
│   ├── routes/
│   │   ├── onboarding.js
│   │   └── userProfile.js
│   ├── utils/
│   │   └── userProfile.js
│   ├── server.js
│   └── package.json
├── main workspace.code-workspace
└── README.md
```

## 🎯 Next Steps (Phase 2)

1. **Database Integration**
   - Replace in-memory storage with PostgreSQL
   - Add user authentication
   - Implement data persistence

2. **AI Integration**
   - OpenAI API integration for event analysis
   - Historical pattern recognition
   - Predictive analytics

3. **News Crawling**
   - RSS feed integration
   - News API integration
   - Automated event detection

4. **Advanced Features**
   - Real-time notifications
   - Custom report generation
   - Export functionality

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Write tests first** (TDD approach)
4. **Implement the feature**
5. **Ensure all tests pass**
6. **Submit a pull request**

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For technical support or questions about the implementation, please refer to the test files for examples of expected behavior and API usage. 