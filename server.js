const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import and initialize database
const { db, initializeDatabase } = require('./data/database');

// Force re-initialize database to ensure sample data is loaded
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const carbonFootprintRoutes = require('./routes/carbonFootprint');
const volunteeringRoutes = require('./routes/volunteering');
const gamificationRoutes = require('./routes/gamification');
const dashboardRoutes = require('./routes/dashboard');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/carbon-footprint', carbonFootprintRoutes);
app.use('/api/volunteering', volunteeringRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Qualcosa è andato storto!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌱 GreenMe Server in esecuzione su http://localhost:${PORT}`);
  console.log(`📊 Dashboard disponibile su http://localhost:${PORT}`);
  console.log(`👥 Database inizializzato con ${db.employees.length} dipendenti`);
  console.log(`🚴 ${db.carbonFootprintEntries.length} tracciamenti carbon footprint`);
  console.log(`🤝 ${db.volunteeringActivities.length} attività di volontariato`);
  console.log(`🏆 ${db.badges.length} badge disponibili`);
});

module.exports = app;

// Made with Bob
