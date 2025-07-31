// backend/routes/onboarding.js
const express = require('express');
const router = express.Router();

router.post('/submit-cro-intake', (req, res) => {
  const profile = req.body;

  console.log('Received profile data:', profile);

  // TODO: Validate input, enrich with external datasets, trigger AI suggestions
  // Save to database:
  // e.g., db.collection('userProfiles').insertOne(profile)
  res.json({ success: true, message: "Profile captured", data: profile });
});

module.exports = router;
