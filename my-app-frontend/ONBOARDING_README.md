# Modular Onboarding Flow

A comprehensive, persona-based onboarding system for B2B SaaS platforms built with React and Material-UI.

## Overview

This onboarding system implements best practices for enterprise software user onboarding:

- **Progressive Profiling**: Collect information only when needed
- **Persona-Based Forms**: Dynamic forms that adapt to user roles
- **Autosave & Resume**: Never lose progress with localStorage persistence
- **5-Minute Setup**: Optimized flow for quick user activation
- **Modular Design**: Easy to extend with new roles and features

## Features

### 🎯 **Multi-Step Wizard**
- Clean, intuitive step-by-step flow
- Visual progress indicator with Material-UI Stepper
- Smooth transitions between steps
- Responsive design for all devices

### 👥 **Persona Selection**
- **Risk Manager**: Enterprise risk oversight and compliance
- **Operations Manager**: Supply chain and operational monitoring
- **Business Analyst**: Data analysis and strategic insights
- **Executive Leader**: Strategic decision making and oversight
- **Compliance Officer**: Regulatory compliance and governance
- **Custom Role**: Flexible configuration for unique needs

### 📝 **Dynamic Form Generation**
- Forms automatically adapt based on selected persona
- Context-aware validation with helpful tooltips
- Progressive disclosure of fields
- Skip optional fields functionality

### 💾 **Autosave & Persistence**
- Automatic saving to localStorage every 1 second
- Resume functionality with 24-hour expiration
- No data loss during browser refresh or navigation
- Clean data cleanup after completion

### 🎨 **Modern UI/UX**
- Material-UI components with custom enterprise theme
- Smooth animations and transitions
- Contextual help and guidance
- Professional, enterprise-grade appearance

## Architecture

### Component Structure

```
ModularOnboardingFlow/
├── BasicInfoForm/          # Step 1: Basic user & organization info
├── PersonaSelection/       # Step 2: Role/persona selection
├── PersonaSpecificForm/    # Step 3: Role-specific configuration
└── ProfileReview/          # Step 4: Review and confirmation
```

### Data Flow

1. **Basic Info** → `basicInfo` state
2. **Persona Selection** → `selectedPersona` state
3. **Role Configuration** → `personaData` state
4. **Review & Complete** → Final submission

### State Management

- React hooks for local state management
- localStorage for persistence
- Debounced autosave (1 second delay)
- Form validation with error handling

## Usage

### Basic Implementation

```jsx
import ModularOnboardingFlow from './components/ModularOnboardingFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<ModularOnboardingFlow />} />
      </Routes>
    </Router>
  );
}
```

### Customization

#### Adding New Personas

1. **Update PersonaSelection.jsx**:
```jsx
const PERSONAS = [
  // ... existing personas
  {
    id: 'newRole',
    name: 'New Role',
    description: 'Description of new role',
    icon: <NewIcon />,
    color: '#color',
    features: ['Feature 1', 'Feature 2'],
    responsibilities: ['Responsibility 1', 'Responsibility 2']
  }
];
```

2. **Update PersonaSpecificForm.jsx**:
```jsx
const PERSONA_FORMS = {
  // ... existing forms
  newRole: {
    title: "New Role Profile",
    description: "Configure your new role preferences",
    icon: <NewIcon />,
    fields: [
      // Define form fields
    ]
  }
};
```

#### Customizing Form Fields

Form fields support multiple types:

```jsx
{
  type: 'text',           // Single line text input
  type: 'select',         // Dropdown selection
  type: 'multiselect',    // Multiple choice selection
  type: 'textarea'        // Multi-line text input
}
```

Field configuration:
```jsx
{
  type: 'select',
  name: 'fieldName',
  label: 'Field Label',
  required: true,
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ],
  helpText: 'Helpful description'
}
```

### Styling & Theming

The system uses Material-UI theming:

```jsx
// Custom theme colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Deep blue for enterprise
    },
    // ... other colors
  }
});
```

## API Integration

### Backend Integration

The system is designed to integrate with your backend:

```jsx
const handleProfileComplete = async (finalData) => {
  try {
    // Send to your backend
    const response = await api.createProfile(finalData);
    
    // Handle success
    navigate('/dashboard');
  } catch (error) {
    // Handle error
    setError(error.message);
  }
};
```

### Data Structure

Final submission data structure:
```json
{
  "basicInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@company.com",
    "organization": "Company Name",
    "organizationSize": "1001-5000 employees"
  },
  "persona": {
    "id": "risk",
    "name": "Risk Manager",
    // ... persona details
  },
  "personaData": {
    "riskTolerance": "medium",
    "riskCategories": ["Geopolitical Risk", "Supply Chain Risk"],
    // ... role-specific data
  },
  "completedAt": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### Available Routes

- `/demo` - Demo page showcasing the system
- `/onboarding` - Legacy onboarding flow
- `/onboarding-modular` - New modular onboarding flow

### Testing Scenarios

1. **Complete Flow**: Go through all steps
2. **Interruption**: Refresh browser mid-flow
3. **Validation**: Test required field validation
4. **Navigation**: Test back/forward navigation
5. **Responsiveness**: Test on different screen sizes

## Performance

### Optimization Features

- Debounced autosave (prevents excessive localStorage writes)
- Lazy loading of form components
- Efficient state updates
- Minimal re-renders with React hooks

### Browser Support

- Modern browsers with ES6+ support
- localStorage required for autosave functionality
- Responsive design for mobile and desktop

## Future Enhancements

### Planned Features

- **Multi-language Support**: Internationalization
- **Advanced Validation**: Custom validation rules
- **Integration Hooks**: Webhook support for external systems
- **Analytics**: User behavior tracking
- **A/B Testing**: Multiple flow variations

### Extension Points

- **Custom Field Types**: Add new input types
- **Conditional Logic**: Show/hide fields based on conditions
- **External Data**: Pre-populate forms from external sources
- **Workflow Engine**: Complex multi-path flows

## Contributing

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

### Code Style

- Use functional components with hooks
- Follow Material-UI design patterns
- Implement proper error handling
- Add comprehensive comments for complex logic

## License

This project is part of the Geopolitical Intelligence Platform.

## Support

For questions or support:
- Email: support@geointel.com
- Phone: +1-555-INTEL-01
- Documentation: [Platform Docs](https://docs.geointel.com) 