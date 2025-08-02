const mongoose = require('mongoose');
const GeopoliticalEvent = require('./models/GeopoliticalEvent');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://masonthomas00:Mohamilton1@geopcluster.xwxx76q.mongodb.net/?retryWrites=true&w=majority&appName=geopcluster')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const events = await GeopoliticalEvent.find({ status: 'active' }).limit(10);
    console.log(`Total events in database: ${await GeopoliticalEvent.countDocuments({ status: 'active' })}`);
    console.log('\nFirst 10 events:');
    
    events.forEach((event, i) => {
      console.log(`${i+1}. ${event.title}`);
      console.log(`   Source: ${event.source?.name || 'No source'}`);
      console.log(`   Created: ${event.createdAt}`);
      console.log(`   Severity: ${event.severity}`);
      console.log('---');
    });
    
    mongoose.connection.close();
  })
  .catch(console.error); 