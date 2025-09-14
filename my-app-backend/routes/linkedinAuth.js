const express = require('express');
const router = express.Router();
const enhancedNewsService = require('../services/enhancedNewsService');

/**
 * GET /api/linkedin/auth
 * Generate LinkedIn OAuth URL
 */
router.get('/auth', (req, res) => {
  try {
    const oauthUrl = enhancedNewsService.generateLinkedInOAuthURL();
    
    res.json({
      success: true,
      message: 'LinkedIn OAuth URL generated',
      oauthUrl: oauthUrl,
      instructions: [
        '1. Visit the oauthUrl above',
        '2. Authorize the application',
        '3. Copy the authorization code from the redirect URL',
        '4. Use POST /api/linkedin/callback with the code'
      ]
    });
    
  } catch (error) {
    console.error('Error generating LinkedIn OAuth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate LinkedIn OAuth URL',
      error: error.message
    });
  }
});

/**
 * POST /api/linkedin/callback
 * Exchange authorization code for access token
 */
router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }
    
    const accessToken = await enhancedNewsService.exchangeLinkedInCodeForToken(code);
    
    res.json({
      success: true,
      message: 'LinkedIn access token obtained successfully',
      accessToken: accessToken,
      instructions: [
        '1. Add this access token to your .env file as LINKEDIN_ACCESS_TOKEN',
        '2. Add it to your Render environment variables',
        '3. Restart your application',
        '4. Test with GET /api/enhanced-news/linkedin'
      ]
    });
    
  } catch (error) {
    console.error('Error exchanging LinkedIn code for token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to exchange authorization code for access token',
      error: error.message
    });
  }
});

/**
 * GET /api/linkedin/test
 * Test LinkedIn API with current access token
 */
router.get('/test', async (req, res) => {
  try {
    const linkedinContent = await enhancedNewsService.fetchFromLinkedIn();
    
    res.json({
      success: true,
      message: 'LinkedIn API test completed',
      count: linkedinContent.length,
      content: linkedinContent.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        author: item.author,
        publishedAt: item.publishedAt,
        url: item.url
      }))
    });
    
  } catch (error) {
    console.error('LinkedIn API test error:', error);
    res.status(500).json({
      success: false,
      message: 'LinkedIn API test failed',
      error: error.message
    });
  }
});

module.exports = router;
