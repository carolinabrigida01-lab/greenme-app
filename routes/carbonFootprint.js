const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { create, getAll, findById, update } = require('../data/database');

// CO2 emission factors (kg CO2 per km)
const CO2_FACTORS = {
  car: parseFloat(process.env.CO2_PER_KM_CAR) || 0.192,
  motorcycle: parseFloat(process.env.CO2_PER_KM_MOTORCYCLE) || 0.103,
  bus: parseFloat(process.env.CO2_PER_KM_BUS) || 0.089,
  train: parseFloat(process.env.CO2_PER_KM_TRAIN) || 0.041,
  bike: parseFloat(process.env.CO2_PER_KM_BIKE) || 0,
  walk: parseFloat(process.env.CO2_PER_KM_WALK) || 0,
  electric_car: 0.053,
  carpool: 0.096 // car / 2
};

// Calculate CO2 emissions
function calculateCO2(transportMode, distance) {
  const factor = CO2_FACTORS[transportMode] || 0;
  return factor * distance;
}

// Calculate points based on CO2 saved
function calculatePoints(co2Saved) {
  const pointsPerKg = parseFloat(process.env.POINTS_PER_KG_CO2_SAVED) || 10;
  return Math.floor(co2Saved * pointsPerKg);
}

// Update employee stats
function updateEmployeeStats(employeeId, co2Saved, points) {
  const employee = findById('employees', employeeId);
  if (employee) {
    const newTotalCO2 = (employee.totalCO2Saved || 0) + co2Saved;
    const newPoints = (employee.points || 0) + points;
    const newLevel = Math.floor(newPoints / 1000) + 1;

    update('employees', employeeId, {
      totalCO2Saved: newTotalCO2,
      points: newPoints,
      level: newLevel
    });
  }
}

// Add carbon footprint entry
router.post('/entries', authenticateToken, (req, res) => {
  try {
    const { 
      date, 
      transportMode, 
      distance, 
      isCommute, 
      notes,
      location 
    } = req.body;

    if (!date || !transportMode || !distance) {
      return res.status(400).json({ 
        error: 'Data, mezzo di trasporto e distanza sono richiesti' 
      });
    }

    const co2Emitted = calculateCO2(transportMode, distance);
    
    // Calculate CO2 saved compared to car
    const carCO2 = calculateCO2('car', distance);
    const co2Saved = Math.max(0, carCO2 - co2Emitted);
    
    const points = calculatePoints(co2Saved);

    const entry = create('carbonFootprintEntries', {
      employeeId: req.user.id,
      date,
      transportMode,
      distance: parseFloat(distance),
      isCommute: isCommute || false,
      co2Emitted: parseFloat(co2Emitted.toFixed(3)),
      co2Saved: parseFloat(co2Saved.toFixed(3)),
      points,
      notes: notes || '',
      location: location || null
    });

    // Update employee stats
    updateEmployeeStats(req.user.id, co2Saved, points);

    res.status(201).json({
      message: 'Registrazione carbon footprint completata',
      entry,
      pointsEarned: points,
      co2Saved: parseFloat(co2Saved.toFixed(3))
    });
  } catch (error) {
    console.error('Add carbon entry error:', error);
    res.status(500).json({ error: 'Errore nella registrazione' });
  }
});

// Get all entries for current employee
router.get('/entries', authenticateToken, (req, res) => {
  try {
    const { startDate, endDate, transportMode } = req.query;
    
    let entries = getAll('carbonFootprintEntries')
      .filter(entry => entry.employeeId === req.user.id);

    // Filter by date range
    if (startDate) {
      entries = entries.filter(entry => entry.date >= startDate);
    }
    if (endDate) {
      entries = entries.filter(entry => entry.date <= endDate);
    }

    // Filter by transport mode
    if (transportMode) {
      entries = entries.filter(entry => entry.transportMode === transportMode);
    }

    // Sort by date descending
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ entries });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle registrazioni' });
  }
});

// Get carbon footprint statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const entries = getAll('carbonFootprintEntries')
      .filter(entry => entry.employeeId === req.user.id);

    const totalCO2Emitted = entries.reduce((sum, entry) => sum + entry.co2Emitted, 0);
    const totalCO2Saved = entries.reduce((sum, entry) => sum + entry.co2Saved, 0);
    const totalDistance = entries.reduce((sum, entry) => sum + entry.distance, 0);

    // Group by transport mode
    const byTransportMode = {};
    entries.forEach(entry => {
      if (!byTransportMode[entry.transportMode]) {
        byTransportMode[entry.transportMode] = {
          count: 0,
          distance: 0,
          co2Emitted: 0,
          co2Saved: 0
        };
      }
      byTransportMode[entry.transportMode].count++;
      byTransportMode[entry.transportMode].distance += entry.distance;
      byTransportMode[entry.transportMode].co2Emitted += entry.co2Emitted;
      byTransportMode[entry.transportMode].co2Saved += entry.co2Saved;
    });

    // Calculate sustainable transport percentage
    const sustainableTransports = ['bike', 'walk', 'bus', 'train', 'electric_car', 'carpool'];
    const sustainableEntries = entries.filter(e => sustainableTransports.includes(e.transportMode));
    const sustainablePercentage = entries.length > 0 
      ? (sustainableEntries.length / entries.length * 100).toFixed(1)
      : 0;

    res.json({
      stats: {
        totalEntries: entries.length,
        totalCO2Emitted: parseFloat(totalCO2Emitted.toFixed(3)),
        totalCO2Saved: parseFloat(totalCO2Saved.toFixed(3)),
        totalDistance: parseFloat(totalDistance.toFixed(2)),
        sustainablePercentage: parseFloat(sustainablePercentage),
        byTransportMode
      }
    });
  } catch (error) {
    console.error('Get carbon stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
});

// Get monthly comparison
router.get('/monthly-comparison', authenticateToken, (req, res) => {
  try {
    const entries = getAll('carbonFootprintEntries')
      .filter(entry => entry.employeeId === req.user.id);

    const monthlyData = {};
    
    entries.forEach(entry => {
      const month = entry.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {
          co2Emitted: 0,
          co2Saved: 0,
          distance: 0,
          entries: 0
        };
      }
      monthlyData[month].co2Emitted += entry.co2Emitted;
      monthlyData[month].co2Saved += entry.co2Saved;
      monthlyData[month].distance += entry.distance;
      monthlyData[month].entries++;
    });

    res.json({ monthlyData });
  } catch (error) {
    console.error('Get monthly comparison error:', error);
    res.status(500).json({ error: 'Errore nel recupero del confronto mensile' });
  }
});

module.exports = router;

// Made with Bob
