import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Warning,
  Error,
  CheckCircle,
  Timeline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function EventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);

  // Sample events data (replace with API call later)
  const sampleEvents = [
    {
      id: 1,
      title: "Supply Chain Disruption in Asia Pacific",
      description: "Port closures and shipping delays affecting major trade routes",
      severity: "high",
      category: "Supply Chain Risk",
      region: "Asia Pacific",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relevanceScore: 0.85
    },
    {
      id: 2,
      title: "New Regulatory Requirements in Europe",
      description: "Updated GDPR compliance requirements for data processing",
      severity: "medium",
      category: "Regulatory Risk",
      region: "Europe",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relevanceScore: 0.72
    },
    {
      id: 3,
      title: "Cybersecurity Threat Detection",
      description: "Advanced persistent threat targeting financial institutions",
      severity: "high",
      category: "Cybersecurity Risk",
      region: "North America",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      relevanceScore: 0.91
    },
    {
      id: 4,
      title: "Market Volatility in Emerging Markets",
      description: "Currency fluctuations and political instability affecting investments",
      severity: "medium",
      category: "Market Risk",
      region: "Latin America",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      relevanceScore: 0.68
    },
    {
      id: 5,
      title: "Environmental Compliance Updates",
      description: "New sustainability reporting requirements for manufacturing",
      severity: "low",
      category: "Environmental Risk",
      region: "North America",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      relevanceScore: 0.45
    },
    {
      id: 6,
      title: "Geopolitical Tensions in Middle East",
      description: "Regional conflicts affecting energy supply and trade routes",
      severity: "high",
      category: "Geopolitical Risk",
      region: "Middle East",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      relevanceScore: 0.78
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setEvents(sampleEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Timeline />;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`, { 
      state: { from: '/events' }
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Events</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and analyze geopolitical events that may impact your organization
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Supply Chain Risk">Supply Chain Risk</MenuItem>
            <MenuItem value="Regulatory Risk">Regulatory Risk</MenuItem>
            <MenuItem value="Cybersecurity Risk">Cybersecurity Risk</MenuItem>
            <MenuItem value="Market Risk">Market Risk</MenuItem>
            <MenuItem value="Environmental Risk">Environmental Risk</MenuItem>
            <MenuItem value="Geopolitical Risk">Geopolitical Risk</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            label="Severity"
          >
            <MenuItem value="all">All Severities</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No events match your current filters. Try adjusting your search criteria.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleEventClick(event.id)}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Event Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      {getSeverityIcon(event.severity)}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {event.title}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {event.description}
                    </Typography>

                    {/* Metadata */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip 
                        label={event.category} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                      <Chip 
                        label={event.region} 
                        size="small" 
                        variant="outlined"
                        icon={<LocationOn />}
                      />
                    </Box>

                    {/* Footer */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {event.timestamp.toLocaleDateString()}
                      </Typography>
                      <Chip 
                        label={`${Math.round(event.relevanceScore * 100)}% relevant`}
                        size="small"
                        color="secondary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
