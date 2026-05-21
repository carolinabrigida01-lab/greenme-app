// In-memory database simulation with sample data
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
  const today = new Date();
  const getDate = (daysAgo) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  // Sample employees with realistic data
  db.employees = [
    {
      id: '1',
      email: 'admin@rm-architettura.it',
      password: '$2a$10$uLf4tjz7GU//P9eEn4ygouP.p1fqQkoL7yp4msjghHKjJ9iL6/Ltu',
      firstName: 'Mario',
      lastName: 'Rossi',
      role: 'admin',
      department: 'Direzione',
      joinDate: '2020-01-15',
      points: 2850,
      level: 3,
      totalCO2Saved: 145.8,
      totalVolunteerHours: 28.5,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'giulia.bianchi@rm-architettura.it',
      password: '$2a$10$uLf4tjz7GU//P9eEn4ygouP.p1fqQkoL7yp4msjghHKjJ9iL6/Ltu',
      firstName: 'Giulia',
      lastName: 'Bianchi',
      role: 'employee',
      department: 'Architettura',
      joinDate: '2021-03-10',
      points: 1920,
      level: 2,
      totalCO2Saved: 98.5,
      totalVolunteerHours: 15.0,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      email: 'luca.verdi@rm-architettura.it',
      password: '$2a$10$uLf4tjz7GU//P9eEn4ygouP.p1fqQkoL7yp4msjghHKjJ9iL6/Ltu',
      firstName: 'Luca',
      lastName: 'Verdi',
      role: 'employee',
      department: 'Consulenza Bandi',
      joinDate: '2021-09-01',
      points: 1650,
      level: 2,
      totalCO2Saved: 76.3,
      totalVolunteerHours: 22.0,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      email: 'sara.ferrari@rm-architettura.it',
      password: '$2a$10$uLf4tjz7GU//P9eEn4ygouP.p1fqQkoL7yp4msjghHKjJ9iL6/Ltu',
      firstName: 'Sara',
      lastName: 'Ferrari',
      role: 'employee',
      department: 'Architettura',
      joinDate: '2022-01-20',
      points: 1380,
      level: 2,
      totalCO2Saved: 62.1,
      totalVolunteerHours: 18.5,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      email: 'marco.colombo@rm-architettura.it',
      password: '$2a$10$uLf4tjz7GU//P9eEn4ygouP.p1fqQkoL7yp4msjghHKjJ9iL6/Ltu',
      firstName: 'Marco',
      lastName: 'Colombo',
      role: 'employee',
      department: 'Amministrazione',
      joinDate: '2022-06-15',
      points: 890,
      level: 1,
      totalCO2Saved: 38.2,
      totalVolunteerHours: 12.0,
      createdAt: new Date().toISOString()
    }
  ];

  // Sample carbon footprint entries
  db.carbonFootprintEntries = [
    // Mario Rossi entries
    { id: 'cf1', employeeId: '1', date: getDate(1), transportMode: 'bike', distance: 8.5, isCommute: true, co2Emitted: 0, co2Saved: 1.632, points: 16, notes: 'Casa-ufficio', createdAt: new Date().toISOString() },
    { id: 'cf2', employeeId: '1', date: getDate(2), transportMode: 'bike', distance: 8.5, isCommute: true, co2Emitted: 0, co2Saved: 1.632, points: 16, notes: 'Casa-ufficio', createdAt: new Date().toISOString() },
    { id: 'cf3', employeeId: '1', date: getDate(3), transportMode: 'train', distance: 45, isCommute: false, co2Emitted: 1.845, co2Saved: 6.795, points: 68, notes: 'Riunione Milano', createdAt: new Date().toISOString() },
    { id: 'cf4', employeeId: '1', date: getDate(5), transportMode: 'bike', distance: 8.5, isCommute: true, co2Emitted: 0, co2Saved: 1.632, points: 16, notes: 'Casa-ufficio', createdAt: new Date().toISOString() },
    { id: 'cf5', employeeId: '1', date: getDate(7), transportMode: 'walk', distance: 2.0, isCommute: false, co2Emitted: 0, co2Saved: 0.384, points: 4, notes: 'Sopralluogo centro', createdAt: new Date().toISOString() },
    
    // Giulia Bianchi entries
    { id: 'cf6', employeeId: '2', date: getDate(1), transportMode: 'bus', distance: 12, isCommute: true, co2Emitted: 1.068, co2Saved: 1.236, points: 12, notes: 'Pendolare', createdAt: new Date().toISOString() },
    { id: 'cf7', employeeId: '2', date: getDate(2), transportMode: 'bus', distance: 12, isCommute: true, co2Emitted: 1.068, co2Saved: 1.236, points: 12, notes: 'Pendolare', createdAt: new Date().toISOString() },
    { id: 'cf8', employeeId: '2', date: getDate(4), transportMode: 'bike', distance: 12, isCommute: true, co2Emitted: 0, co2Saved: 2.304, points: 23, notes: 'Giornata sostenibile', createdAt: new Date().toISOString() },
    { id: 'cf9', employeeId: '2', date: getDate(6), transportMode: 'carpool', distance: 25, isCommute: false, co2Emitted: 2.4, co2Saved: 2.4, points: 24, notes: 'Cantiere con collega', createdAt: new Date().toISOString() },
    
    // Luca Verdi entries
    { id: 'cf10', employeeId: '3', date: getDate(1), transportMode: 'train', distance: 18, isCommute: true, co2Emitted: 0.738, co2Saved: 2.718, points: 27, notes: 'Treno regionale', createdAt: new Date().toISOString() },
    { id: 'cf11', employeeId: '3', date: getDate(2), transportMode: 'train', distance: 18, isCommute: true, co2Emitted: 0.738, co2Saved: 2.718, points: 27, notes: 'Treno regionale', createdAt: new Date().toISOString() },
    { id: 'cf12', employeeId: '3', date: getDate(3), transportMode: 'bike', distance: 5, isCommute: false, co2Emitted: 0, co2Saved: 0.96, points: 10, notes: 'Visita cliente', createdAt: new Date().toISOString() },
    
    // Sara Ferrari entries
    { id: 'cf13', employeeId: '4', date: getDate(1), transportMode: 'bike', distance: 6.5, isCommute: true, co2Emitted: 0, co2Saved: 1.248, points: 12, notes: 'Bici elettrica', createdAt: new Date().toISOString() },
    { id: 'cf14', employeeId: '4', date: getDate(2), transportMode: 'walk', distance: 6.5, isCommute: true, co2Emitted: 0, co2Saved: 1.248, points: 12, notes: 'A piedi', createdAt: new Date().toISOString() },
    { id: 'cf15', employeeId: '4', date: getDate(4), transportMode: 'bus', distance: 15, isCommute: false, co2Emitted: 1.335, co2Saved: 1.545, points: 15, notes: 'Sopralluogo', createdAt: new Date().toISOString() },
    
    // Marco Colombo entries
    { id: 'cf16', employeeId: '5', date: getDate(1), transportMode: 'car', distance: 15, isCommute: true, co2Emitted: 2.88, co2Saved: 0, points: 0, notes: 'Auto', createdAt: new Date().toISOString() },
    { id: 'cf17', employeeId: '5', date: getDate(3), transportMode: 'bus', distance: 15, isCommute: true, co2Emitted: 1.335, co2Saved: 1.545, points: 15, notes: 'Provo autobus', createdAt: new Date().toISOString() },
    { id: 'cf18', employeeId: '5', date: getDate(5), transportMode: 'carpool', distance: 15, isCommute: true, co2Emitted: 1.44, co2Saved: 1.44, points: 14, notes: 'Carpooling con collega', createdAt: new Date().toISOString() }
  ];

  // Sample volunteering activities
  db.volunteeringActivities = [
    // Mario Rossi activities
    {
      id: 'vol1',
      employeeId: '1',
      date: getDate(5),
      activityType: 'street_cleaning',
      activityName: 'Pulizia Strade',
      hours: 4.0,
      description: 'Pulizia area verde Piazza della Vittoria con team aziendale',
      location: 'Pavia Centro',
      latitude: 45.1847,
      longitude: 9.1582,
      photos: [],
      points: 200,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'vol2',
      employeeId: '1',
      date: getDate(12),
      activityType: 'green_planting',
      activityName: 'Piantumazione Aree Verdi',
      hours: 5.5,
      description: 'Piantumazione alberi nel Parco della Vernavola',
      location: 'Parco Vernavola, Pavia',
      latitude: 45.1950,
      longitude: 9.1450,
      photos: [],
      points: 275,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    
    // Giulia Bianchi activities
    {
      id: 'vol3',
      employeeId: '2',
      date: getDate(3),
      activityType: 'urban_decor',
      activityName: 'Cura Decoro Urbano',
      hours: 3.0,
      description: 'Sistemazione aiuole e pulizia marciapiedi via Mentana',
      location: 'Via Mentana, Pavia',
      latitude: 45.1875,
      longitude: 9.1600,
      photos: [],
      points: 150,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'vol4',
      employeeId: '2',
      date: getDate(10),
      activityType: 'park_maintenance',
      activityName: 'Manutenzione Parchi',
      hours: 4.5,
      description: 'Manutenzione sentieri e pulizia Parco Visconteo',
      location: 'Parco Visconteo, Pavia',
      latitude: 45.1920,
      longitude: 9.1550,
      photos: [],
      points: 225,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    
    // Luca Verdi activities
    {
      id: 'vol5',
      employeeId: '3',
      date: getDate(2),
      activityType: 'street_cleaning',
      activityName: 'Pulizia Strade',
      hours: 3.5,
      description: 'Pulizia straordinaria Corso Cavour',
      location: 'Corso Cavour, Pavia',
      latitude: 45.1860,
      longitude: 9.1590,
      photos: [],
      points: 175,
      verified: false,
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'vol6',
      employeeId: '3',
      date: getDate(8),
      activityType: 'community_garden',
      activityName: 'Orto Comunitario',
      hours: 6.0,
      description: 'Lavoro nell\'orto comunitario di quartiere Vallone',
      location: 'Quartiere Vallone, Pavia',
      latitude: 45.1800,
      longitude: 9.1650,
      photos: [],
      points: 300,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    
    // Sara Ferrari activities
    {
      id: 'vol7',
      employeeId: '4',
      date: getDate(4),
      activityType: 'green_planting',
      activityName: 'Piantumazione Aree Verdi',
      hours: 4.0,
      description: 'Piantumazione fiori e arbusti giardini pubblici',
      location: 'Giardini Pubblici, Pavia',
      latitude: 45.1890,
      longitude: 9.1570,
      photos: [],
      points: 200,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'vol8',
      employeeId: '4',
      date: getDate(11),
      activityType: 'graffiti_removal',
      activityName: 'Rimozione Graffiti',
      hours: 3.5,
      description: 'Pulizia graffiti muri centro storico',
      location: 'Centro Storico, Pavia',
      latitude: 45.1850,
      longitude: 9.1580,
      photos: [],
      points: 175,
      verified: false,
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date().toISOString()
    },
    
    // Marco Colombo activities
    {
      id: 'vol9',
      employeeId: '5',
      date: getDate(6),
      activityType: 'street_cleaning',
      activityName: 'Pulizia Strade',
      hours: 2.5,
      description: 'Prima esperienza volontariato - pulizia parco',
      location: 'Parco Cittadella, Pavia',
      latitude: 45.1830,
      longitude: 9.1620,
      photos: [],
      points: 125,
      verified: true,
      verifiedBy: '1',
      verifiedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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

  // Award some badges
  db.employeeBadges = [
    {
      id: 'eb1',
      employeeId: '1',
      badgeId: 'badge_2',
      earnedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'eb2',
      employeeId: '1',
      badgeId: 'badge_3',
      earnedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'eb3',
      employeeId: '2',
      badgeId: 'badge_2',
      earnedAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'eb4',
      employeeId: '3',
      badgeId: 'badge_3',
      earnedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample challenges
  db.challenges = [
    {
      id: 'challenge_1',
      title: 'Settimana della Mobilità Sostenibile',
      description: 'Usa solo mezzi di trasporto sostenibili per una settimana',
      type: 'carbon_footprint',
      startDate: getDate(-2),
      endDate: getDate(5),
      goal: { type: 'sustainable_commutes', value: 7 },
      reward: 200,
      active: true,
      participants: ['1', '2', '3', '4']
    },
    {
      id: 'challenge_2',
      title: 'Puliamo Pavia',
      description: 'Partecipa ad almeno 3 attività di pulizia urbana questo mese',
      type: 'volunteering',
      startDate: getDate(-5),
      endDate: getDate(25),
      goal: { type: 'cleaning_activities', value: 3 },
      reward: 300,
      active: true,
      participants: ['1', '2', '5']
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

// Initialize database on load - ALWAYS initialize with sample data
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
