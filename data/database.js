// In-memory database simulation
// In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)

const db = {
  employees: [],
  carbonFootprintEntries: [],
  volunteeringActivities: [],
  challenges: [],
  badges: [],
  employeeBadges: [],
  leaderboard: []
};

// Initialize with sample data
function initializeDatabase() {
  // Sample employees
  db.employees = [
    {
      id: '1',
      email: 'admin@rm-architettura.it',
      password: '$2a$10$uLf4tjz7GU//P9eEn4ygouP.p1fqQkoL7yp4msjghHKjJ9iL6/Ltu', // password: admin123
      firstName: 'Mario',
      lastName: 'Rossi',
      role: 'admin',
      department: 'Direzione',
      joinDate: '2020-01-15',
      points: 0,
      level: 1,
      totalCO2Saved: 0,
      totalVolunteerHours: 0,
      createdAt: new Date().toISOString()
    }
  ];

  // Sample badges
  db.badges = [
    {
      id: 'badge_1',
      name: 'Eco Warrior',
      description: 'Riduci 100 kg di CO2',
      icon: '🌍',
      requirement: { type: 'co2_saved', value: 100 },
      points: 500
    },
    {
      id: 'badge_2',
      name: 'Green Commuter',
      description: 'Usa mezzi sostenibili per 30 giorni',
      icon: '🚴',
      requirement: { type: 'sustainable_days', value: 30 },
      points: 300
    },
    {
      id: 'badge_3',
      name: 'Volontario del Mese',
      description: 'Completa 20 ore di volontariato',
      icon: '🤝',
      requirement: { type: 'volunteer_hours', value: 20 },
      points: 400
    },
    {
      id: 'badge_4',
      name: 'Guardiano della Città',
      description: 'Partecipa a 10 attività di rigenerazione urbana',
      icon: '🏙️',
      requirement: { type: 'urban_activities', value: 10 },
      points: 350
    },
    {
      id: 'badge_5',
      name: 'Pioniere Verde',
      description: 'Primo dipendente a raggiungere livello 5',
      icon: '⭐',
      requirement: { type: 'level', value: 5 },
      points: 1000
    }
  ];

  // Sample challenges
  db.challenges = [
    {
      id: 'challenge_1',
      title: 'Settimana della Mobilità Sostenibile',
      description: 'Usa solo mezzi di trasporto sostenibili per una settimana',
      type: 'carbon_footprint',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      goal: { type: 'sustainable_commutes', value: 7 },
      reward: 200,
      active: true,
      participants: []
    },
    {
      id: 'challenge_2',
      title: 'Puliamo Pavia',
      description: 'Partecipa ad almeno 3 attività di pulizia urbana questo mese',
      type: 'volunteering',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      goal: { type: 'cleaning_activities', value: 3 },
      reward: 300,
      active: true,
      participants: []
    }
  ];
}

// Helper functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function findById(collection, id) {
  return db[collection].find(item => item.id === id);
}

function findByEmail(email) {
  return db.employees.find(emp => emp.email === email);
}

function create(collection, data) {
  const newItem = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString()
  };
  db[collection].push(newItem);
  return newItem;
}

function update(collection, id, data) {
  const index = db[collection].findIndex(item => item.id === id);
  if (index !== -1) {
    db[collection][index] = {
      ...db[collection][index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return db[collection][index];
  }
  return null;
}

function deleteItem(collection, id) {
  const index = db[collection].findIndex(item => item.id === id);
  if (index !== -1) {
    return db[collection].splice(index, 1)[0];
  }
  return null;
}

function getAll(collection) {
  return db[collection];
}

// Initialize database on load
initializeDatabase();

module.exports = {
  db,
  generateId,
  findById,
  findByEmail,
  create,
  update,
  deleteItem,
  getAll,
  initializeDatabase
};

// Made with Bob
