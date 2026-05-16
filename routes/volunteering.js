const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { create, getAll, findById, update } = require('../data/database');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/volunteering/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'volunteer-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo immagini sono permesse (jpeg, jpg, png, gif)'));
    }
  }
});

// Activity types for urban regeneration
const ACTIVITY_TYPES = {
  street_cleaning: 'Pulizia Strade',
  green_planting: 'Piantumazione Aree Verdi',
  urban_decor: 'Cura Decoro Urbano',
  park_maintenance: 'Manutenzione Parchi',
  graffiti_removal: 'Rimozione Graffiti',
  community_garden: 'Orto Comunitario',
  other: 'Altro'
};

// Calculate points for volunteering
function calculateVolunteerPoints(hours) {
  const pointsPerHour = parseFloat(process.env.POINTS_PER_VOLUNTEER_HOUR) || 50;
  return Math.floor(hours * pointsPerHour);
}

// Update employee volunteer stats
function updateEmployeeVolunteerStats(employeeId, hours, points) {
  const employee = findById('employees', employeeId);
  if (employee) {
    const newTotalHours = (employee.totalVolunteerHours || 0) + hours;
    const newPoints = (employee.points || 0) + points;
    const newLevel = Math.floor(newPoints / 1000) + 1;

    update('employees', employeeId, {
      totalVolunteerHours: newTotalHours,
      points: newPoints,
      level: newLevel
    });
  }
}

// Add volunteering activity
router.post('/activities', authenticateToken, upload.array('photos', 5), (req, res) => {
  try {
    const { 
      date, 
      activityType, 
      hours, 
      description,
      location,
      latitude,
      longitude
    } = req.body;

    if (!date || !activityType || !hours) {
      return res.status(400).json({ 
        error: 'Data, tipo di attività e ore sono richiesti' 
      });
    }

    const hoursFloat = parseFloat(hours);
    if (hoursFloat <= 0 || hoursFloat > 24) {
      return res.status(400).json({ 
        error: 'Le ore devono essere tra 0 e 24' 
      });
    }

    const points = calculateVolunteerPoints(hoursFloat);

    // Get uploaded photo paths
    const photos = req.files ? req.files.map(file => `/uploads/volunteering/${file.filename}`) : [];

    const activity = create('volunteeringActivities', {
      employeeId: req.user.id,
      date,
      activityType,
      activityName: ACTIVITY_TYPES[activityType] || activityType,
      hours: hoursFloat,
      description: description || '',
      location: location || 'Pavia',
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      photos,
      points,
      verified: false,
      verifiedBy: null,
      verifiedAt: null
    });

    // Update employee stats
    updateEmployeeVolunteerStats(req.user.id, hoursFloat, points);

    res.status(201).json({
      message: 'Attività di volontariato registrata con successo',
      activity,
      pointsEarned: points
    });
  } catch (error) {
    console.error('Add volunteering activity error:', error);
    res.status(500).json({ error: 'Errore nella registrazione dell\'attività' });
  }
});

// Get all activities for current employee
router.get('/activities', authenticateToken, (req, res) => {
  try {
    const { startDate, endDate, activityType, verified } = req.query;
    
    let activities = getAll('volunteeringActivities')
      .filter(activity => activity.employeeId === req.user.id);

    // Filter by date range
    if (startDate) {
      activities = activities.filter(activity => activity.date >= startDate);
    }
    if (endDate) {
      activities = activities.filter(activity => activity.date <= endDate);
    }

    // Filter by activity type
    if (activityType) {
      activities = activities.filter(activity => activity.activityType === activityType);
    }

    // Filter by verification status
    if (verified !== undefined) {
      const isVerified = verified === 'true';
      activities = activities.filter(activity => activity.verified === isVerified);
    }

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle attività' });
  }
});

// Get volunteering statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const activities = getAll('volunteeringActivities')
      .filter(activity => activity.employeeId === req.user.id);

    const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0);
    const totalActivities = activities.length;
    const verifiedActivities = activities.filter(a => a.verified).length;

    // Group by activity type
    const byActivityType = {};
    activities.forEach(activity => {
      if (!byActivityType[activity.activityType]) {
        byActivityType[activity.activityType] = {
          name: activity.activityName,
          count: 0,
          hours: 0
        };
      }
      byActivityType[activity.activityType].count++;
      byActivityType[activity.activityType].hours += activity.hours;
    });

    // Monthly breakdown
    const monthlyHours = {};
    activities.forEach(activity => {
      const month = activity.date.substring(0, 7); // YYYY-MM
      monthlyHours[month] = (monthlyHours[month] || 0) + activity.hours;
    });

    res.json({
      stats: {
        totalHours: parseFloat(totalHours.toFixed(2)),
        totalActivities,
        verifiedActivities,
        verificationRate: totalActivities > 0 
          ? parseFloat((verifiedActivities / totalActivities * 100).toFixed(1))
          : 0,
        byActivityType,
        monthlyHours
      }
    });
  } catch (error) {
    console.error('Get volunteering stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
});

// Get activity types
router.get('/activity-types', authenticateToken, (req, res) => {
  res.json({ activityTypes: ACTIVITY_TYPES });
});

// Get all activities (admin only - for verification)
router.get('/all-activities', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (employee.role !== 'admin') {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    const activities = getAll('volunteeringActivities');
    
    // Enrich with employee info
    const enrichedActivities = activities.map(activity => {
      const emp = findById('employees', activity.employeeId);
      return {
        ...activity,
        employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'
      };
    });

    // Sort by date descending
    enrichedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ activities: enrichedActivities });
  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle attività' });
  }
});

// Verify activity (admin only)
router.put('/activities/:id/verify', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (employee.role !== 'admin') {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    const activity = findById('volunteeringActivities', req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Attività non trovata' });
    }

    const updatedActivity = update('volunteeringActivities', req.params.id, {
      verified: true,
      verifiedBy: req.user.id,
      verifiedAt: new Date().toISOString()
    });

    res.json({
      message: 'Attività verificata con successo',
      activity: updatedActivity
    });
  } catch (error) {
    console.error('Verify activity error:', error);
    res.status(500).json({ error: 'Errore nella verifica dell\'attività' });
  }
});

module.exports = router;

// Made with Bob
