import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CrisisRoom from './CrisisRoom';

export default function CrisisRoomTest() {
  const [crisisRoomId, setCrisisRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCrisisRoom, setShowCrisisRoom] = useState(false);

  const handleLoadCrisisRoom = async () => {
    if (!crisisRoomId.trim()) {
      setError('Please enter a Crisis Room ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Test if the crisis room exists by making a simple API call
             const response = await fetch(`https://geop-backend.onrender.com/api/crisis-rooms/${crisisRoomId}`);
      
      if (!response.ok) {
        throw new Error('Crisis room not found. Please check the ID and try again.');
      }

      setShowCrisisRoom(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowCrisisRoom(false);
    setCrisisRoomId('');
    setError(null);
  };

  if (showCrisisRoom) {
    return (
      <Box sx={{ height: '100vh' }}>
        <CrisisRoom 
          crisisRoomId={crisisRoomId} 
          onClose={handleBack}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Crisis Room Test
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Enter a Crisis Room ID to test the crisis communications functionality.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How to get a Crisis Room ID:
            </Typography>
            <Typography variant="body2" paragraph>
              1. Run the backend test script: <code>npm run test:crisis</code>
            </Typography>
            <Typography variant="body2" paragraph>
              2. Copy the Crisis Room ID from the test output
            </Typography>
            <Typography variant="body2">
              3. Paste it in the field below and click "Load Crisis Room"
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Crisis Room ID"
              value={crisisRoomId}
              onChange={(e) => setCrisisRoomId(e.target.value)}
              placeholder="Enter the Crisis Room ID from the test script"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLoadCrisisRoom}
              disabled={loading || !crisisRoomId.trim()}
              sx={{ height: 56 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Load Crisis Room'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Test Features Available:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    📊 Overview Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View crisis statistics, recent communications, and quick actions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    📧 Communications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Send multi-channel communications and view history
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    👥 Stakeholders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage stakeholder contacts and notification preferences
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    📈 Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View response rates, engagement metrics, and performance data
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
} 