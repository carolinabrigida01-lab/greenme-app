const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { getAll, findById, update } = require('../data/database');

// Get all employees (admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
  try {
    const employees = getAll('employees').map(emp => ({
      id: emp.id,
      email: emp.email,
      firstName: emp.firstName,
      lastName: emp.lastName,
      role: emp.role,
      department: emp.department,
      joinDate: emp.joinDate,
      points: emp.points,
      level: emp.level,
      totalCO2Saved: emp.totalCO2Saved,
      totalVolunteerHours: emp.totalVolunteerHours
    }));

    res.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei dipendenti' });
  }
});

// Get employee profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Dipendente non trovato' });
    }

    res.json({
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        department: employee.department,
        joinDate: employee.joinDate,
        points: employee.points,
        level: employee.level,
        totalCO2Saved: employee.totalCO2Saved,
        totalVolunteerHours: employee.totalVolunteerHours
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Errore nel recupero del profilo' });
  }
});

// Update employee profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    
    const updatedEmployee = update('employees', req.user.id, {
      firstName,
      lastName,
      department
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Dipendente non trovato' });
    }

    res.json({
      message: 'Profilo aggiornato con successo',
      employee: {
        id: updatedEmployee.id,
        email: updatedEmployee.email,
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        department: updatedEmployee.department
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento del profilo' });
  }
});

// Get employee statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const employee = findById('employees', req.user.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Dipendente non trovato' });
    }

    const carbonEntries = getAll('carbonFootprintEntries')
      .filter(entry => entry.employeeId === req.user.id);
    
    const volunteerActivities = getAll('volunteeringActivities')
      .filter(activity => activity.employeeId === req.user.id);

    const employeeBadges = getAll('employeeBadges')
      .filter(eb => eb.employeeId === req.user.id);

    res.json({
      stats: {
        points: employee.points,
        level: employee.level,
        totalCO2Saved: employee.totalCO2Saved,
        totalVolunteerHours: employee.totalVolunteerHours,
        carbonEntriesCount: carbonEntries.length,
        volunteerActivitiesCount: volunteerActivities.length,
        badgesEarned: employeeBadges.length
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
});

module.exports = router;

// Made with Bob
