const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB se connect karein
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection failed:', err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/incidents', require('./routes/incidentRoutes'));

app.use('/api/resources', require('./routes/resourceRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));