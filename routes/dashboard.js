const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAll, findById } = require('../data/database');

// Get dashboard overview
router.get('/overview', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Dipendente non trovato' });
    }

    // Get recent carbon entries
    const carbonEntries = getAll('carbonFootprintEntries')
      .filter(entry => entry.employeeId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Get recent volunteer activities
    const volunteerActivities = getAll('volunteeringActivities')
      .filter(activity => activity.employeeId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Get active challenges
    const challenges = getAll('challenges')
      .filter(c => c.active && c.participants.includes(req.user.id));

    // Get recent badges
    const employeeBadges = getAll('employeeBadges')
      .filter(eb => eb.employeeId === req.user.id)
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
      .slice(0, 3);

    const recentBadges = employeeBadges.map(eb => {
      const badge = findById('badges', eb.badgeId);
      return {
        ...badge,
        earnedAt: eb.earnedAt
      };
    });

    // Calculate this month's stats
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const thisMonthCarbon = getAll('carbonFootprintEntries')
      .filter(e => e.employeeId === req.user.id && e.date.startsWith(thisMonth));
    
    const thisMonthVolunteer = getAll('volunteeringActivities')
      .filter(a => a.employeeId === req.user.id && a.date.startsWith(thisMonth));

    const monthStats = {
      co2Saved: thisMonthCarbon.reduce((sum, e) => sum + e.co2Saved, 0),
      volunteerHours: thisMonthVolunteer.reduce((sum, a) => sum + a.hours, 0),
      activities: thisMonthCarbon.length + thisMonthVolunteer.length
    };

    // Get rank
    const allEmployees = getAll('employees')
      .sort((a, b) => b.points - a.points);
    const rank = allEmployees.findIndex(emp => emp.id === req.user.id) + 1;

    res.json({
      overview: {
        employee: {
          name: `${employee.firstName} ${employee.lastName}`,
          department: employee.department,
          points: employee.points,
          level: employee.level,
          rank,
          totalEmployees: allEmployees.length
        },
        stats: {
          totalCO2Saved: employee.totalCO2Saved,
          totalVolunteerHours: employee.totalVolunteerHours,
          totalBadges: employeeBadges.length,
          activeChallenges: challenges.length
        },
        thisMonth: monthStats,
        recentActivities: {
          carbon: carbonEntries,
          volunteer: volunteerActivities
        },
        recentBadges,
        activeChallenges: challenges
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ error: 'Errore nel recupero della dashboard' });
  }
});

// Get company-wide statistics (admin only)
router.get('/company-stats', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (employee.role !== 'admin') {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    const employees = getAll('employees');
    const carbonEntries = getAll('carbonFootprintEntries');
    const volunteerActivities = getAll('volunteeringActivities');

    // Total stats
    const totalCO2Saved = carbonEntries.reduce((sum, e) => sum + e.co2Saved, 0);
    const totalVolunteerHours = volunteerActivities.reduce((sum, a) => sum + a.hours, 0);
    const totalPoints = employees.reduce((sum, e) => sum + e.points, 0);

    // Average per employee
    const avgCO2PerEmployee = employees.length > 0 ? totalCO2Saved / employees.length : 0;
    const avgHoursPerEmployee = employees.length > 0 ? totalVolunteerHours / employees.length : 0;

    // Transport mode distribution
    const transportModes = {};
    carbonEntries.forEach(entry => {
      transportModes[entry.transportMode] = (transportModes[entry.transportMode] || 0) + 1;
    });

    // Activity type distribution
    const activityTypes = {};
    volunteerActivities.forEach(activity => {
      activityTypes[activity.activityType] = (activityTypes[activity.activityType] || 0) + 1;
    });

    // Monthly trends
    const monthlyData = {};
    carbonEntries.forEach(entry => {
      const month = entry.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { co2Saved: 0, entries: 0 };
      }
      monthlyData[month].co2Saved += entry.co2Saved;
      monthlyData[month].entries++;
    });

    volunteerActivities.forEach(activity => {
      const month = activity.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { volunteerHours: 0, activities: 0 };
      }
      monthlyData[month].volunteerHours = (monthlyData[month].volunteerHours || 0) + activity.hours;
      monthlyData[month].activities = (monthlyData[month].activities || 0) + 1;
    });

    // Top performers
    const topPerformers = employees
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map((emp, index) => ({
        rank: index + 1,
        name: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        points: emp.points,
        level: emp.level,
        co2Saved: emp.totalCO2Saved,
        volunteerHours: emp.totalVolunteerHours
      }));

    res.json({
      companyStats: {
        totals: {
          employees: employees.length,
          co2Saved: parseFloat(totalCO2Saved.toFixed(3)),
          volunteerHours: parseFloat(totalVolunteerHours.toFixed(2)),
          points: totalPoints,
          carbonEntries: carbonEntries.length,
          volunteerActivities: volunteerActivities.length
        },
        averages: {
          co2PerEmployee: parseFloat(avgCO2PerEmployee.toFixed(3)),
          hoursPerEmployee: parseFloat(avgHoursPerEmployee.toFixed(2))
        },
        distributions: {
          transportModes,
          activityTypes
        },
        monthlyTrends: monthlyData,
        topPerformers
      }
    });
  } catch (error) {
    console.error('Get company stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche aziendali' });
  }
});

// Get ESG report data
router.get('/esg-report', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (employee.role !== 'admin') {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    const { startDate, endDate } = req.query;

    let carbonEntries = getAll('carbonFootprintEntries');
    let volunteerActivities = getAll('volunteeringActivities');

    // Filter by date range if provided
    if (startDate) {
      carbonEntries = carbonEntries.filter(e => e.date >= startDate);
      volunteerActivities = volunteerActivities.filter(a => a.date >= startDate);
    }
    if (endDate) {
      carbonEntries = carbonEntries.filter(e => e.date <= endDate);
      volunteerActivities = volunteerActivities.filter(a => a.date <= endDate);
    }

    // Scope 3 emissions (employee commuting)
    const scope3Emissions = {
      totalEmissions: carbonEntries.reduce((sum, e) => sum + e.co2Emitted, 0),
      totalDistance: carbonEntries.reduce((sum, e) => sum + e.distance, 0),
      commuteEntries: carbonEntries.filter(e => e.isCommute).length,
      reductionAchieved: carbonEntries.reduce((sum, e) => sum + e.co2Saved, 0)
    };

    // Social impact (volunteering)
    const socialImpact = {
      totalHours: volunteerActivities.reduce((sum, a) => sum + a.hours, 0),
      totalActivities: volunteerActivities.length,
      verifiedActivities: volunteerActivities.filter(a => a.verified).length,
      participationRate: getAll('employees').length > 0
        ? (new Set(volunteerActivities.map(a => a.employeeId)).size / getAll('employees').length * 100).toFixed(1)
        : 0
    };

    // Sustainability metrics
    const sustainableTransports = ['bike', 'walk', 'bus', 'train', 'electric_car', 'carpool'];
    const sustainableEntries = carbonEntries.filter(e => sustainableTransports.includes(e.transportMode));
    
    const metrics = {
      sustainabilityRate: carbonEntries.length > 0
        ? (sustainableEntries.length / carbonEntries.length * 100).toFixed(1)
        : 0,
      avgCO2PerKm: scope3Emissions.totalDistance > 0
        ? (scope3Emissions.totalEmissions / scope3Emissions.totalDistance).toFixed(3)
        : 0,
      employeeEngagement: getAll('employees').length > 0
        ? ((new Set([...carbonEntries.map(e => e.employeeId), ...volunteerActivities.map(a => a.employeeId)]).size / getAll('employees').length) * 100).toFixed(1)
        : 0
    };

    res.json({
      esgReport: {
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present'
        },
        scope3Emissions,
        socialImpact,
        metrics,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get ESG report error:', error);
    res.status(500).json({ error: 'Errore nel recupero del report ESG' });
  }
});

module.exports = router;

// Made with Bob
