import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Alert,
  useTheme,
  IconButton,
  MenuItem
} from '@mui/material';
import {
  Help,
  ArrowBack,
  ExpandMore,
  Book,
  VideoLibrary,
  Support,
  Email,
  Phone,
  Chat,
  Article,
  Troubleshoot,
  Download,
  OpenInNew
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function HelpSupport() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const faqData = [
    {
      question: "How do I set up my company profile?",
      answer: "Navigate to Settings > Company Profile to configure your company information, business units, risk categories, and regions of interest. You can also update this information from the onboarding flow."
    },
    {
      question: "How do I customize my notification preferences?",
      answer: "Go to Settings > Notification Preferences to adjust alert frequency, notification methods, and priority levels. Changes are saved automatically."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Visit Settings > Data & Privacy to export all your profile information, preferences, and settings in JSON format."
    },
    {
      question: "How do I change my password?",
      answer: "Navigate to Settings > Account Settings and click 'Change Password' to update your password securely."
    },
    {
      question: "What risk categories are available?",
      answer: "We offer 12 risk categories including Geopolitical Risk, Supply Chain Risk, Cybersecurity Risk, Financial Risk, and more. You can select multiple categories relevant to your business."
    },
    {
      question: "How do I manage my business units?",
      answer: "In Company Profile settings, you can select from 15 distinct business units including Executive Leadership, Finance & Accounting, Risk Management, and more."
    }
  ];

  const documentationSections = [
    {
      title: "Getting Started Guide",
      description: "Complete setup and configuration walkthrough",
      icon: <Book color="primary" />,
      link: "/docs/getting-started"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for key features",
      icon: <VideoLibrary color="primary" />,
      link: "/docs/tutorials"
    },
    {
      title: "API Documentation",
      description: "Technical integration and API reference",
      icon: <Article color="primary" />,
      link: "/docs/api"
    },
    {
      title: "Troubleshooting Guide",
      description: "Common issues and solutions",
      icon: <Troubleshoot color="primary" />,
      link: "/docs/troubleshooting"
    }
  ];

  const supportChannels = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: <Email color="primary" />,
      action: "support@geointel.com",
      type: "email"
    },
    {
      title: "Phone Support",
      description: "Speak with our support team",
      icon: <Phone color="primary" />,
      action: "+1 (555) 123-4567",
      type: "phone"
    },
    {
      title: "Live Chat",
      description: "Real-time chat support during business hours",
      icon: <Chat color="primary" />,
      action: "Start Chat",
      type: "chat"
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setContactForm({ subject: '', message: '' });
  };

  const handleSupportAction = (channel) => {
    switch (channel.type) {
      case 'email':
        window.open(`mailto:${channel.action}?subject=Support Request`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${channel.action}`, '_blank');
        break;
      case 'chat':
        // Here you would typically open a chat widget
        alert('Live chat feature coming soon!');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/settings')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Help color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Help & Support
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Find answers, documentation, and get help when you need it
        </Typography>
      </Box>

      {/* Success Message */}
      {submitted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your support request has been submitted! We'll get back to you within 24 hours.
        </Alert>
      )}

      {/* Quick Help */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Quick Help
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Book />}
              onClick={() => navigate('/onboarding')}
              sx={{ py: 2 }}
            >
              Update Onboarding Info
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Download />}
              onClick={() => navigate('/settings/privacy')}
              sx={{ py: 2 }}
            >
              Export My Data
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Documentation */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Documentation & Resources
        </Typography>
        
        <Grid container spacing={3}>
          {documentationSections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
                onClick={() => window.open(section.link, '_blank')}
              >
                <Box sx={{ mb: 2 }}>
                  {section.icon}
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {section.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {section.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* FAQ */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Frequently Asked Questions
        </Typography>
        
        {faqData.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Support Channels */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Support color="primary" />
          Get Support
        </Typography>
        
        <Grid container spacing={3}>
          {supportChannels.map((channel) => (
            <Grid item xs={12} sm={4} key={channel.title}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
                onClick={() => handleSupportAction(channel)}
              >
                <Box sx={{ mb: 2 }}>
                  {channel.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {channel.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {channel.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<OpenInNew />}
                >
                  {channel.action}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Contact Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Contact Support Team
        </Typography>
        
        <form onSubmit={handleContactSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                required
              />
            </Grid>
            

            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Please describe your issue or question in detail..."
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Email />}
                size="large"
              >
                Send Support Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Additional Resources */}
      <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Can't find what you're looking for? Check out our{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => window.open('/docs', '_blank')}
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            complete documentation
          </Button>
          {' '}or{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => window.open('/community', '_blank')}
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            community forum
          </Button>
          .
        </Typography>
      </Paper>
    </Box>
  );
} 