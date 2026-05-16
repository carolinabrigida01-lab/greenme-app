const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAll, findById, create, update } = require('../data/database');

// Get all badges
router.get('/badges', authenticateToken, (req, res) => {
  try {
    const badges = getAll('badges');
    const employeeBadges = getAll('employeeBadges')
      .filter(eb => eb.employeeId === req.user.id);

    const badgesWithStatus = badges.map(badge => ({
      ...badge,
      earned: employeeBadges.some(eb => eb.badgeId === badge.id),
      earnedAt: employeeBadges.find(eb => eb.badgeId === badge.id)?.earnedAt || null
    }));

    res.json({ badges: badgesWithStatus });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei badge' });
  }
});

// Get employee badges
router.get('/my-badges', authenticateToken, (req, res) => {
  try {
    const employeeBadges = getAll('employeeBadges')
      .filter(eb => eb.employeeId === req.user.id);

    const badges = employeeBadges.map(eb => {
      const badge = findById('badges', eb.badgeId);
      return {
        ...badge,
        earnedAt: eb.earnedAt
      };
    });

    res.json({ badges });
  } catch (error) {
    console.error('Get my badges error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei tuoi badge' });
  }
});

// Check and award badges
function checkAndAwardBadges(employeeId) {
  const employee = findById('employees', employeeId);
  if (!employee) return [];

  const badges = getAll('badges');
  const employeeBadges = getAll('employeeBadges')
    .filter(eb => eb.employeeId === employeeId);
  const earnedBadgeIds = employeeBadges.map(eb => eb.badgeId);

  const carbonEntries = getAll('carbonFootprintEntries')
    .filter(entry => entry.employeeId === employeeId);
  const volunteerActivities = getAll('volunteeringActivities')
    .filter(activity => activity.employeeId === employeeId);

  const newBadges = [];

  badges.forEach(badge => {
    // Skip if already earned
    if (earnedBadgeIds.includes(badge.id)) return;

    let earned = false;

    switch (badge.requirement.type) {
      case 'co2_saved':
        earned = employee.totalCO2Saved >= badge.requirement.value;
        break;
      
      case 'volunteer_hours':
        earned = employee.totalVolunteerHours >= badge.requirement.value;
        break;
      
      case 'level':
        earned = employee.level >= badge.requirement.value;
        break;
      
      case 'sustainable_days':
        const sustainableTransports = ['bike', 'walk', 'bus', 'train', 'electric_car', 'carpool'];
        const sustainableDays = new Set(
          carbonEntries
            .filter(e => sustainableTransports.includes(e.transportMode))
            .map(e => e.date)
        ).size;
        earned = sustainableDays >= badge.requirement.value;
        break;
      
      case 'urban_activities':
        earned = volunteerActivities.length >= badge.requirement.value;
        break;
    }

    if (earned) {
      const employeeBadge = create('employeeBadges', {
        employeeId,
        badgeId: badge.id,
        earnedAt: new Date().toISOString()
      });

      // Award badge points
      update('employees', employeeId, {
        points: employee.points + badge.points
      });

      newBadges.push({
        ...badge,
        earnedAt: employeeBadge.earnedAt
      });
    }
  });

  return newBadges;
}

// Check badges for current employee
router.post('/check-badges', authenticateToken, (req, res) => {
  try {
    const newBadges = checkAndAwardBadges(req.user.id);

    if (newBadges.length > 0) {
      res.json({
        message: `Congratulazioni! Hai guadagnato ${newBadges.length} nuov${newBadges.length === 1 ? 'o' : 'i'} badge!`,
        badges: newBadges
      });
    } else {
      res.json({
        message: 'Nessun nuovo badge al momento',
        badges: []
      });
    }
  } catch (error) {
    console.error('Check badges error:', error);
    res.status(500).json({ error: 'Errore nel controllo dei badge' });
  }
});

// Get all challenges
router.get('/challenges', authenticateToken, (req, res) => {
  try {
    const challenges = getAll('challenges').filter(c => c.active);

    const challengesWithStatus = challenges.map(challenge => {
      const isParticipating = challenge.participants.includes(req.user.id);
      
      let progress = 0;
      if (isParticipating) {
        // Calculate progress based on challenge type
        if (challenge.type === 'carbon_footprint') {
          const entries = getAll('carbonFootprintEntries')
            .filter(e => 
              e.employeeId === req.user.id &&
              e.date >= challenge.startDate &&
              e.date <= challenge.endDate
            );

          if (challenge.goal.type === 'sustainable_commutes') {
            const sustainableTransports = ['bike', 'walk', 'bus', 'train', 'electric_car', 'carpool'];
            progress = entries.filter(e => sustainableTransports.includes(e.transportMode)).length;
          }
        } else if (challenge.type === 'volunteering') {
          const activities = getAll('volunteeringActivities')
            .filter(a => 
              a.employeeId === req.user.id &&
              a.date >= challenge.startDate &&
              a.date <= challenge.endDate
            );

          if (challenge.goal.type === 'cleaning_activities') {
            progress = activities.filter(a => a.activityType === 'street_cleaning').length;
          }
        }
      }

      return {
        ...challenge,
        isParticipating,
        progress,
        completed: progress >= challenge.goal.value
      };
    });

    res.json({ challenges: challengesWithStatus });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle sfide' });
  }
});

// Join a challenge
router.post('/challenges/:id/join', authenticateToken, (req, res) => {
  try {
    const challenge = findById('challenges', req.params.id);

    if (!challenge) {
      return res.status(404).json({ error: 'Sfida non trovata' });
    }

    if (!challenge.active) {
      return res.status(400).json({ error: 'Questa sfida non è più attiva' });
    }

    if (challenge.participants.includes(req.user.id)) {
      return res.status(400).json({ error: 'Sei già iscritto a questa sfida' });
    }

    const updatedChallenge = update('challenges', req.params.id, {
      participants: [...challenge.participants, req.user.id]
    });

    res.json({
      message: 'Ti sei iscritto alla sfida con successo!',
      challenge: updatedChallenge
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ error: 'Errore nell\'iscrizione alla sfida' });
  }
});

// Get leaderboard
router.get('/leaderboard', authenticateToken, (req, res) => {
  try {
    const { type = 'points', period = 'all' } = req.query;

    let employees = getAll('employees').map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      points: emp.points,
      level: emp.level,
      totalCO2Saved: emp.totalCO2Saved,
      totalVolunteerHours: emp.totalVolunteerHours
    }));

    // Sort based on type
    switch (type) {
      case 'points':
        employees.sort((a, b) => b.points - a.points);
        break;
      case 'co2':
        employees.sort((a, b) => b.totalCO2Saved - a.totalCO2Saved);
        break;
      case 'volunteer':
        employees.sort((a, b) => b.totalVolunteerHours - a.totalVolunteerHours);
        break;
    }

    // Add rank
    employees = employees.map((emp, index) => ({
      ...emp,
      rank: index + 1,
      isCurrentUser: emp.id === req.user.id
    }));

    res.json({ leaderboard: employees });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Errore nel recupero della classifica' });
  }
});

// Get employee rank
router.get('/my-rank', authenticateToken, (req, res) => {
  try {
    const employees = getAll('employees')
      .sort((a, b) => b.points - a.points);

    const rank = employees.findIndex(emp => emp.id === req.user.id) + 1;
    const totalEmployees = employees.length;

    const employee = findById('employees', req.user.id);

    res.json({
      rank,
      totalEmployees,
      points: employee.points,
      level: employee.level,
      percentile: totalEmployees > 0 
        ? parseFloat((100 - (rank / totalEmployees * 100)).toFixed(1))
        : 0
    });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({ error: 'Errore nel recupero della posizione' });
  }
});

module.exports = router;

// Made with Bob
