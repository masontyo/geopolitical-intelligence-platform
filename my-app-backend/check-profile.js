const mongoose = require('mongoose');
const UserProfile = require('./models/UserProfile');
require('dotenv').config();

async function checkProfile() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const profileId = '688e58db83612282c8e13b48';
    
    // Check if the profile exists
    const profile = await UserProfile.findById(profileId);
    
    if (profile) {
      console.log('✅ Profile found:');
      console.log('  Name:', profile.name);
      console.log('  Company:', profile.company);
      console.log('  Email:', profile.email);
      console.log('  Industry:', profile.industry);
    } else {
      console.log('❌ Profile not found with ID:', profileId);
      
      // List all profiles
      const allProfiles = await UserProfile.find().select('_id name company email');
      console.log('\nAvailable profiles:');
      allProfiles.forEach(p => {
        console.log(`  ${p._id} - ${p.name} (${p.company})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkProfile(); 