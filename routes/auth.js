const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, create } = require('../data/database');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email è richiesta' });
    }

    const employee = findByEmail(email);
    
    if (!employee) {
      return res.status(401).json({ error: 'Email non trovata' });
    }

    // In development, skip password check
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (!isDevelopment) {
      // In production, check password
      if (!password) {
        return res.status(400).json({ error: 'Password è richiesta' });
      }
      
      const validPassword = await bcrypt.compare(password, employee.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Password non valida' });
      }
    }

    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        role: employee.role
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login effettuato con successo',
      token,
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        department: employee.department,
        points: employee.points,
        level: employee.level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
});

// Register endpoint (for admin to create new employees)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, department } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tutti i campi sono richiesti' });
    }

    const existingEmployee = findByEmail(email);
    
    if (existingEmployee) {
      return res.status(409).json({ error: 'Email già registrata' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = create('employees', {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'employee',
      department: department || 'General',
      joinDate: new Date().toISOString().split('T')[0],
      points: 0,
      level: 1,
      totalCO2Saved: 0,
      totalVolunteerHours: 0
    });

    res.status(201).json({
      message: 'Dipendente registrato con successo',
      employee: {
        id: newEmployee.id,
        email: newEmployee.email,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        department: newEmployee.department
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
});

module.exports = router;

// Made with Bob
