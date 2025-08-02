const mongoose = require('mongoose');
const GeopoliticalEvent = require('./models/GeopoliticalEvent');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://masonthomas00:Mohamilton1@geopcluster.xwxx76q.mongodb.net/?retryWrites=true&w=majority&appName=geopcluster')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const events = await GeopoliticalEvent.find({ status: 'active' });
    console.log(`Total active events in database: ${events.length}`);
    
    events.forEach((event, i) => {
      console.log(`Event ${i+1}: ${event.title} (ID: ${event._id})`);
      console.log('  Source:', event.source?.name || 'No source');
      console.log('  Created:', event.createdAt);
      console.log('---');
    });
    
    mongoose.connection.close();
  })
  .catch(console.error); 