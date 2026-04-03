import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import promptRoutes from './routes/prompts.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/prompts/admin', adminRoutes);

// Socket.io Real-Time Collaboration Logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a specific document
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`Socket ${socket.id} joined document: ${documentId}`);
  });

  // User broadcasts text changes
  socket.on('send-changes', ({ documentId, content }) => {
    // Broadcast to everyone else in the room
    socket.to(documentId).emit('receive-changes', content);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creative-prompts-ai';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
