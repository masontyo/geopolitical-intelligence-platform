/**
 * Test script for News API functionality
 * Run this to test your news API setup
 */

require('dotenv').config();
const axios = require('axios');

const NEWSAPI_KEY = '00a28673b0414caabfadd792f7d0b7f8';

async function testNewsAPI() {
  try {
    console.log('Testing News API...');
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'geopolitical OR sanctions OR trade war OR military conflict',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: NEWSAPI_KEY
      }
    });
    
    console.log('✅ News API test successful!');
    console.log(`Found ${response.data.articles.length} articles`);
    
    response.data.articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   Published: ${article.publishedAt}`);
      console.log('---');
    });
    
    return response.data.articles;
    
  } catch (error) {
    console.error('❌ News API test failed:', error.response?.data || error.message);
    return null;
  }
}

testNewsAPI(); 