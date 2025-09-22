// Minimal test server to check if basic Express works
const express = require('express');
const app = express();
const PORT = 3001;

console.log('🧪 Testing basic Express server...');

app.use(express.json());

app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ status: 'ok', message: 'Basic server working' });
});

app.get('/api/onboarding/status/:userId', (req, res) => {
  console.log('✅ Onboarding status requested for:', req.params.userId);
  res.json({
    status: 'not_started',
    completionPercentage: 0,
    message: 'Basic endpoint working'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Basic test server running on port ${PORT}`);
});

