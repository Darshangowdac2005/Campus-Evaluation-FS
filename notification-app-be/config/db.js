// helper to connect to MongoDB
// tries local MongoDB first, falls back to in-memory server if not available
// this way it works without installing MongoDB locally

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

async function connectDB() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-notifications';

    try {
        // try connecting to local MongoDB first
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        console.log('Connected to MongoDB (local)');
    } catch (err) {
        // local MongoDB not available, start an in-memory one
        console.log('Local MongoDB not available, starting in-memory server...');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await mongoose.connect(memUri);
        console.log('Connected to MongoDB (in-memory)');
        console.log('Note: data will be lost when server stops');
    }
}

async function disconnectDB() {
    await mongoose.disconnect();
    if (memoryServer) {
        await memoryServer.stop();
    }
}

module.exports = { connectDB, disconnectDB };
