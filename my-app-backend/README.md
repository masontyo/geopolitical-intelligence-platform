# Geopolitical Intelligence Platform

A comprehensive platform for monitoring and analyzing geopolitical events that impact business operations. The platform provides personalized intelligence dashboards, automated relevance scoring, and actionable insights for risk management professionals.

## 🚀 Features

### Core Functionality
- **Personalized Intelligence Dashboard**: Real-time geopolitical event monitoring tailored to your organization
- **Smart Relevance Scoring**: AI-powered algorithm that ranks events by relevance to your business
- **Comprehensive Event Analysis**: Detailed geopolitical events with historical context and predictive analytics
- **User Profile Management**: Sophisticated user profiles with business units, risk tolerance, and areas of concern
- **Actionable Insights**: Specific recommendations and actions based on event analysis

### Technical Features
- **Modern React Frontend**: Built with Material-UI for professional, responsive design
- **Node.js/Express Backend**: RESTful API with MongoDB database
- **Real-time Updates**: Live dashboard updates with loading states and error handling
- **Comprehensive Testing**: Full test suite with unit, integration, and API tests
- **Sample Data**: Rich dataset of geopolitical events for demonstration and testing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd geopolitical-intelligence-platform
```

### 2. Backend Setup
```bash
cd my-app-backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/geopolitical-intelligence

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
cd my-app-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Sample Data

The platform comes with comprehensive sample data including:

### Geopolitical Events (10 events)
- US-China Trade Tensions
- EU Digital Services Act Implementation
- Middle East Energy Transition
- African Continental Free Trade Area
- Cybersecurity Breaches
- Latin America Lithium Mining
- Southeast Asia Digital Economy
- Arctic Shipping Routes
- Semiconductor Supply Chain Restructuring
- European Green Hydrogen Initiative

### User Profiles (5 profiles)
- **Sarah Johnson** (TechCorp Global) - Chief Risk Officer
- **Marcus Chen** (Global Energy Solutions) - Strategic Planning Director
- **Elena Rodriguez** (International Trade Partners) - Trade Compliance Manager
- **David Thompson** (Financial Services International) - Head of Risk Management
- **Aisha Patel** (Sustainable Development Corp) - Environmental Impact Director

## 🧪 Testing

### Backend Tests
```bash
cd my-app-backend

# Run all tests
npm test

# Run specific test suites
npm run test:api        # API endpoint tests
npm run test:integration # Integration tests
npm run test:unit       # Unit tests

# Run tests with coverage
npm test -- --coverage
```

### Frontend Tests
```bash
cd my-app-frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

## 📚 API Documentation

### User Profile Endpoints

#### POST /api/user-profile
Create or update a user profile
```json
{
  "name": "John Doe",
  "company": "TechCorp",
  "role": "Chief Risk Officer",
  "businessUnits": [
    {
      "name": "Technology Division",
      "regions": ["North America", "Asia-Pacific"]
    }
  ],
  "areasOfConcern": [
    {
      "category": "Supply Chain Disruption",
      "priority": "high"
    }
  ],
  "riskTolerance": "medium",
  "regions": ["North America", "Europe"],
  "countries": ["United States", "Germany"],
  "industries": ["Technology", "Manufacturing"]
}
```

#### GET /api/user-profile/:id
Retrieve a specific user profile

#### GET /api/user-profile/:id/relevant-events
Get relevant geopolitical events for a user profile
- Query parameter: `threshold` (default: 0.5) - Minimum relevance score

### Geopolitical Events Endpoints

#### GET /api/events
Retrieve all geopolitical events (sorted by date)

#### POST /api/events
Create a new geopolitical event
```json
{
  "title": "Event Title",
  "description": "Event description",
  "categories": ["Technology", "Trade"],
  "regions": ["Asia-Pacific"],
  "countries": ["China", "Japan"],
  "severity": "high",
  "impact": {
    "economic": "negative",
    "political": "neutral",
    "social": "neutral"
  }
}
```

## 🎯 Usage Guide

### 1. User Onboarding
1. **Profile Setup**: Enter basic information and company details
2. **Business Details**: Define business units, regions, and areas of concern
3. **Review & Confirm**: Review your profile information
4. **Smart Suggestions**: Get personalized recommendations
5. **Dashboard Access**: Access your personalized intelligence dashboard

### 2. Dashboard Features
- **Profile Summary**: Overview of your organization and risk profile
- **Relevant Events**: Geopolitical events ranked by relevance to your business
- **Event Details**: Comprehensive analysis including:
  - Historical context and similar patterns
  - Predictive analytics and scenarios
  - Actionable insights and recommendations
  - Source reliability and impact assessment

### 3. Event Analysis
Each geopolitical event includes:
- **Basic Information**: Title, description, date, categories
- **Geographic Scope**: Regions and countries affected
- **Impact Assessment**: Economic, political, and social impacts
- **Historical Context**: Previous occurrences and similar patterns
- **Predictive Analytics**: Likelihood, timeframe, and scenarios
- **Actionable Insights**: Specific recommendations with priority levels

## 🔧 Configuration

### Environment Variables (Backend)
```env
MONGODB_URI=mongodb://localhost:27017/geopolitical-intelligence
PORT=5000
NODE_ENV=development
```

### Relevance Scoring Algorithm
The platform uses a sophisticated algorithm that considers:
- **Category Matching**: Alignment with user's areas of concern
- **Geographic Relevance**: Events in user's regions/countries
- **Severity Assessment**: Event severity vs. user's risk tolerance
- **Business Unit Alignment**: Relevance to specific business units
- **Impact Analysis**: Economic, political, and social impacts

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@geointel.com
- **Phone**: +1-555-INTEL-01
- **Documentation**: [Full API Documentation](docs/api.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🔮 Roadmap

### Week 3: Advanced Analytics
- Machine learning-powered event prediction
- Advanced filtering and search capabilities
- Custom alert configurations
- Export and reporting features

### Week 4: Enterprise Features
- Multi-user organization management
- Role-based access control
- Advanced dashboard customization
- Integration APIs for third-party systems

### Week 5: Mobile & Real-time
- Mobile application
- Real-time notifications
- WebSocket integration
- Offline capability

---

**Built with ❤️ for risk management professionals** 