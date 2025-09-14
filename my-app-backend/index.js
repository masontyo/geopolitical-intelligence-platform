const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fresh Start App</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
            .status { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .steps { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .steps h3 { color: #495057; margin-top: 0; }
            .steps ul { color: #6c757d; }
            .location { background: #e2e3e5; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Fresh Start App</h1>
            <div class="status">
                <h2>✅ Server is running!</h2>
                <p>Your new application is now running on port ${PORT}</p>
                <p>This is a completely fresh start - no existing code or dependencies from your previous project.</p>
            </div>
            <div class="steps">
                <h3>Next steps:</h3>
                <ul>
                    <li>Open this folder in your editor as a new workspace</li>
                    <li>Start building your new application</li>
                    <li>Install additional dependencies as needed</li>
                    <li>Customize this starter template</li>
                </ul>
            </div>
            <div class="location">
                <strong>Project Location:</strong> C:\\fresh-start-app
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'Fresh start app is ready!',
    timestamp: new Date().toISOString(),
    location: __dirname
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fresh start app running on http://localhost:${PORT}`);
  console.log(`📁 Project location: ${__dirname}`);
});
