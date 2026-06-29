const express = require('express');
require('dotenv').config();

const { connectDB } = require('./config/db');
const notificationRoutes = require('./routes/notifications');
const { requestLogger } = require('./middleware/logger');
const { autoSeed } = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(require('cors')());
app.use(express.json());
app.use(requestLogger);

// routes
app.use('/notifications', notificationRoutes);

// basic health check - added this early on to make sure server was running
app.get('/', (req, res) => {
    res.json({ message: 'Campus Notification API is running' });
});

// connect to mongodb and start server
connectDB()
    .then(async () => {
        // auto-seed if database is empty (useful for in-memory or fresh installs)
        await autoSeed();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    });
