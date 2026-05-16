# API Documentation - GreenMe

Documentazione completa delle API REST di GreenMe.

**Base URL**: `http://localhost:3000/api`

**Autenticazione**: JWT Bearer Token (tranne login e register)

## Indice

- [Autenticazione](#autenticazione)
- [Dipendenti](#dipendenti)
- [Carbon Footprint](#carbon-footprint)
- [Volontariato](#volontariato)
- [Gamification](#gamification)
- [Dashboard](#dashboard)
- [Codici di Stato](#codici-di-stato)
- [Esempi di Utilizzo](#esempi-di-utilizzo)

---

## Autenticazione

### Login

Autentica un dipendente e ottiene un token JWT.

**Endpoint**: `POST /auth/login`

**Headers**: 
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "admin@rm-architettura.it",
  "password": "admin123"
}
```

**Response Success (200)**:
```json
{
  "message": "Login effettuato con successo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": "1",
    "email": "admin@rm-architettura.it",
    "firstName": "Mario",
    "lastName": "Rossi",
    "role": "admin",
    "department": "Direzione",
    "points": 0,
    "level": 1
  }
}
```

**Response Error (401)**:
```json
{
  "error": "Credenziali non valide"
}
```

### Registrazione

Crea un nuovo account dipendente (richiede autenticazione).

**Endpoint**: `POST /auth/register`

**Headers**: 
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:
```json
{
  "email": "nuovo@rm-architettura.it",
  "password": "password123",
  "firstName": "Luca",
  "lastName": "Bianchi",
  "department": "Architettura"
}
```

**Response Success (201)**:
```json
{
  "message": "Dipendente registrato con successo",
  "employee": {
    "id": "abc123",
    "email": "nuovo@rm-architettura.it",
    "firstName": "Luca",
    "lastName": "Bianchi",
    "department": "Architettura"
  }
}
```

---

## Dipendenti

Tutte le richieste richiedono autenticazione.

### Lista Dipendenti (Admin)

**Endpoint**: `GET /employees`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "employees": [
    {
      "id": "1",
      "email": "admin@rm-architettura.it",
      "firstName": "Mario",
      "lastName": "Rossi",
      "role": "admin",
      "department": "Direzione",
      "joinDate": "2020-01-15",
      "points": 1500,
      "level": 2,
      "totalCO2Saved": 45.5,
      "totalVolunteerHours": 12.5
    }
  ]
}
```

### Profilo Utente

**Endpoint**: `GET /employees/profile`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "employee": {
    "id": "1",
    "email": "admin@rm-architettura.it",
    "firstName": "Mario",
    "lastName": "Rossi",
    "role": "admin",
    "department": "Direzione",
    "joinDate": "2020-01-15",
    "points": 1500,
    "level": 2,
    "totalCO2Saved": 45.5,
    "totalVolunteerHours": 12.5
  }
}
```

### Aggiorna Profilo

**Endpoint**: `PUT /employees/profile`

**Headers**: 
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:
```json
{
  "firstName": "Mario",
  "lastName": "Rossi",
  "department": "Direzione"
}
```

**Response (200)**:
```json
{
  "message": "Profilo aggiornato con successo",
  "employee": {
    "id": "1",
    "email": "admin@rm-architettura.it",
    "firstName": "Mario",
    "lastName": "Rossi",
    "department": "Direzione"
  }
}
```

### Statistiche Personali

**Endpoint**: `GET /employees/stats`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "stats": {
    "points": 1500,
    "level": 2,
    "totalCO2Saved": 45.5,
    "totalVolunteerHours": 12.5,
    "carbonEntriesCount": 25,
    "volunteerActivitiesCount": 5,
    "badgesEarned": 3
  }
}
```

---

## Carbon Footprint

### Aggiungi Spostamento

**Endpoint**: `POST /carbon-footprint/entries`

**Headers**: 
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:
```json
{
  "date": "2024-05-16",
  "transportMode": "bike",
  "distance": 5.5,
  "isCommute": true,
  "notes": "Spostamento casa-lavoro",
  "location": {
    "latitude": 45.1847,
    "longitude": 9.1582
  }
}
```

**Transport Modes**:
- `car` - Auto
- `motorcycle` - Moto
- `bus` - Autobus
- `train` - Treno
- `bike` - Bicicletta
- `walk` - A piedi
- `electric_car` - Auto Elettrica
- `carpool` - Carpooling

**Response (201)**:
```json
{
  "message": "Registrazione carbon footprint completata",
  "entry": {
    "id": "xyz789",
    "employeeId": "1",
    "date": "2024-05-16",
    "transportMode": "bike",
    "distance": 5.5,
    "isCommute": true,
    "co2Emitted": 0,
    "co2Saved": 1.056,
    "points": 10,
    "notes": "Spostamento casa-lavoro",
    "location": null,
    "createdAt": "2024-05-16T10:30:00.000Z"
  },
  "pointsEarned": 10,
  "co2Saved": 1.056
}
```

### Lista Spostamenti

**Endpoint**: `GET /carbon-footprint/entries`

**Query Parameters**:
- `startDate` (optional): Data inizio (YYYY-MM-DD)
- `endDate` (optional): Data fine (YYYY-MM-DD)
- `transportMode` (optional): Filtra per mezzo

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "entries": [
    {
      "id": "xyz789",
      "employeeId": "1",
      "date": "2024-05-16",
      "transportMode": "bike",
      "distance": 5.5,
      "isCommute": true,
      "co2Emitted": 0,
      "co2Saved": 1.056,
      "points": 10,
      "notes": "Spostamento casa-lavoro",
      "createdAt": "2024-05-16T10:30:00.000Z"
    }
  ]
}
```

### Statistiche Carbon Footprint

**Endpoint**: `GET /carbon-footprint/stats`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "stats": {
    "totalEntries": 25,
    "totalCO2Emitted": 15.5,
    "totalCO2Saved": 45.5,
    "totalDistance": 125.5,
    "sustainablePercentage": 75.5,
    "byTransportMode": {
      "bike": {
        "count": 15,
        "distance": 75.5,
        "co2Emitted": 0,
        "co2Saved": 14.496
      },
      "car": {
        "count": 10,
        "distance": 50,
        "co2Emitted": 9.6,
        "co2Saved": 0
      }
    }
  }
}
```

### Confronto Mensile

**Endpoint**: `GET /carbon-footprint/monthly-comparison`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "monthlyData": {
    "2024-04": {
      "co2Emitted": 8.5,
      "co2Saved": 20.3,
      "distance": 65.5,
      "entries": 12
    },
    "2024-05": {
      "co2Emitted": 7.0,
      "co2Saved": 25.2,
      "distance": 60.0,
      "entries": 13
    }
  }
}
```

---

## Volontariato

### Aggiungi Attività

**Endpoint**: `POST /volunteering/activities`

**Headers**: 
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Body (Form Data)**:
```
date: 2024-05-16
activityType: street_cleaning
hours: 3.5
location: Pavia Centro
latitude: 45.1847
longitude: 9.1582
description: Pulizia area verde Piazza della Vittoria
photos: [file1.jpg, file2.jpg]
```

**Activity Types**:
- `street_cleaning` - Pulizia Strade
- `green_planting` - Piantumazione Aree Verdi
- `urban_decor` - Cura Decoro Urbano
- `park_maintenance` - Manutenzione Parchi
- `graffiti_removal` - Rimozione Graffiti
- `community_garden` - Orto Comunitario
- `other` - Altro

**Response (201)**:
```json
{
  "message": "Attività di volontariato registrata con successo",
  "activity": {
    "id": "vol123",
    "employeeId": "1",
    "date": "2024-05-16",
    "activityType": "street_cleaning",
    "activityName": "Pulizia Strade",
    "hours": 3.5,
    "description": "Pulizia area verde Piazza della Vittoria",
    "location": "Pavia Centro",
    "latitude": 45.1847,
    "longitude": 9.1582,
    "photos": ["/uploads/volunteering/volunteer-123456.jpg"],
    "points": 175,
    "verified": false,
    "createdAt": "2024-05-16T14:30:00.000Z"
  },
  "pointsEarned": 175
}
```

### Lista Attività

**Endpoint**: `GET /volunteering/activities`

**Query Parameters**:
- `startDate` (optional): Data inizio
- `endDate` (optional): Data fine
- `activityType` (optional): Filtra per tipo
- `verified` (optional): true/false

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "activities": [
    {
      "id": "vol123",
      "employeeId": "1",
      "date": "2024-05-16",
      "activityType": "street_cleaning",
      "activityName": "Pulizia Strade",
      "hours": 3.5,
      "description": "Pulizia area verde",
      "location": "Pavia Centro",
      "photos": ["/uploads/volunteering/volunteer-123456.jpg"],
      "points": 175,
      "verified": false,
      "createdAt": "2024-05-16T14:30:00.000Z"
    }
  ]
}
```

### Statistiche Volontariato

**Endpoint**: `GET /volunteering/stats`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "stats": {
    "totalHours": 12.5,
    "totalActivities": 5,
    "verifiedActivities": 3,
    "verificationRate": 60.0,
    "byActivityType": {
      "street_cleaning": {
        "name": "Pulizia Strade",
        "count": 3,
        "hours": 8.5
      }
    },
    "monthlyHours": {
      "2024-04": 5.0,
      "2024-05": 7.5
    }
  }
}
```

### Tipi di Attività

**Endpoint**: `GET /volunteering/activity-types`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "activityTypes": {
    "street_cleaning": "Pulizia Strade",
    "green_planting": "Piantumazione Aree Verdi",
    "urban_decor": "Cura Decoro Urbano",
    "park_maintenance": "Manutenzione Parchi",
    "graffiti_removal": "Rimozione Graffiti",
    "community_garden": "Orto Comunitario",
    "other": "Altro"
  }
}
```

### Verifica Attività (Admin)

**Endpoint**: `PUT /volunteering/activities/:id/verify`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "message": "Attività verificata con successo",
  "activity": {
    "id": "vol123",
    "verified": true,
    "verifiedBy": "1",
    "verifiedAt": "2024-05-16T15:00:00.000Z"
  }
}
```

---

## Gamification

### Lista Badge

**Endpoint**: `GET /gamification/badges`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "badges": [
    {
      "id": "badge_1",
      "name": "Eco Warrior",
      "description": "Riduci 100 kg di CO2",
      "icon": "🌍",
      "requirement": {
        "type": "co2_saved",
        "value": 100
      },
      "points": 500,
      "earned": false,
      "earnedAt": null
    }
  ]
}
```

### I Miei Badge

**Endpoint**: `GET /gamification/my-badges`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "badges": [
    {
      "id": "badge_2",
      "name": "Green Commuter",
      "description": "Usa mezzi sostenibili per 30 giorni",
      "icon": "🚴",
      "points": 300,
      "earnedAt": "2024-05-10T10:00:00.000Z"
    }
  ]
}
```

### Controlla Nuovi Badge

**Endpoint**: `POST /gamification/check-badges`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "message": "Congratulazioni! Hai guadagnato 1 nuovo badge!",
  "badges": [
    {
      "id": "badge_1",
      "name": "Eco Warrior",
      "icon": "🌍",
      "earnedAt": "2024-05-16T16:00:00.000Z"
    }
  ]
}
```

### Lista Sfide

**Endpoint**: `GET /gamification/challenges`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "challenges": [
    {
      "id": "challenge_1",
      "title": "Settimana della Mobilità Sostenibile",
      "description": "Usa solo mezzi sostenibili per una settimana",
      "type": "carbon_footprint",
      "startDate": "2024-05-13",
      "endDate": "2024-05-20",
      "goal": {
        "type": "sustainable_commutes",
        "value": 7
      },
      "reward": 200,
      "active": true,
      "isParticipating": true,
      "progress": 4,
      "completed": false
    }
  ]
}
```

### Iscriviti a Sfida

**Endpoint**: `POST /gamification/challenges/:id/join`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "message": "Ti sei iscritto alla sfida con successo!",
  "challenge": {
    "id": "challenge_1",
    "title": "Settimana della Mobilità Sostenibile",
    "participants": ["1", "2", "3"]
  }
}
```

### Classifica

**Endpoint**: `GET /gamification/leaderboard`

**Query Parameters**:
- `type` (optional): points | co2 | volunteer (default: points)
- `period` (optional): all | month | week (default: all)

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "leaderboard": [
    {
      "id": "1",
      "name": "Mario Rossi",
      "department": "Direzione",
      "points": 1500,
      "level": 2,
      "totalCO2Saved": 45.5,
      "totalVolunteerHours": 12.5,
      "rank": 1,
      "isCurrentUser": true
    }
  ]
}
```

### La Mia Posizione

**Endpoint**: `GET /gamification/my-rank`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "rank": 1,
  "totalEmployees": 10,
  "points": 1500,
  "level": 2,
  "percentile": 90.0
}
```

---

## Dashboard

### Panoramica Dashboard

**Endpoint**: `GET /dashboard/overview`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "overview": {
    "employee": {
      "name": "Mario Rossi",
      "department": "Direzione",
      "points": 1500,
      "level": 2,
      "rank": 1,
      "totalEmployees": 10
    },
    "stats": {
      "totalCO2Saved": 45.5,
      "totalVolunteerHours": 12.5,
      "totalBadges": 3,
      "activeChallenges": 2
    },
    "thisMonth": {
      "co2Saved": 15.2,
      "volunteerHours": 4.5,
      "activities": 8
    },
    "recentActivities": {
      "carbon": [],
      "volunteer": []
    },
    "recentBadges": [],
    "activeChallenges": []
  }
}
```

### Statistiche Aziendali (Admin)

**Endpoint**: `GET /dashboard/company-stats`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "companyStats": {
    "totals": {
      "employees": 10,
      "co2Saved": 455.5,
      "volunteerHours": 125.5,
      "points": 15000,
      "carbonEntries": 250,
      "volunteerActivities": 50
    },
    "averages": {
      "co2PerEmployee": 45.55,
      "hoursPerEmployee": 12.55
    },
    "distributions": {
      "transportModes": {
        "bike": 150,
        "car": 50,
        "bus": 30
      },
      "activityTypes": {
        "street_cleaning": 25,
        "green_planting": 15
      }
    },
    "monthlyTrends": {},
    "topPerformers": []
  }
}
```

### Report ESG (Admin)

**Endpoint**: `GET /dashboard/esg-report`

**Query Parameters**:
- `startDate` (optional): Data inizio
- `endDate` (optional): Data fine

**Headers**: 
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "esgReport": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-05-16"
    },
    "scope3Emissions": {
      "totalEmissions": 155.5,
      "totalDistance": 1255.5,
      "commuteEntries": 200,
      "reductionAchieved": 455.5
    },
    "socialImpact": {
      "totalHours": 125.5,
      "totalActivities": 50,
      "verifiedActivities": 35,
      "participationRate": 80.0
    },
    "metrics": {
      "sustainabilityRate": 75.5,
      "avgCO2PerKm": 0.124,
      "employeeEngagement": 85.0
    },
    "generatedAt": "2024-05-16T16:30:00.000Z"
  }
}
```

---

## Codici di Stato

- **200 OK**: Richiesta completata con successo
- **201 Created**: Risorsa creata con successo
- **400 Bad Request**: Dati richiesta non validi
- **401 Unauthorized**: Autenticazione richiesta o fallita
- **403 Forbidden**: Accesso negato (permessi insufficienti)
- **404 Not Found**: Risorsa non trovata
- **409 Conflict**: Conflitto (es. email già esistente)
- **500 Internal Server Error**: Errore del server

---

## Esempi di Utilizzo

### Esempio: Workflow Completo

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rm-architettura.it","password":"admin123"}' \
  | jq -r '.token')

# 2. Aggiungi spostamento
curl -X POST http://localhost:3000/api/carbon-footprint/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "date": "2024-05-16",
    "transportMode": "bike",
    "distance": 5.5,
    "isCommute": true
  }'

# 3. Controlla nuovi badge
curl -X POST http://localhost:3000/api/gamification/check-badges \
  -H "Authorization: Bearer $TOKEN"

# 4. Visualizza classifica
curl http://localhost:3000/api/gamification/leaderboard \
  -H "Authorization: Bearer $TOKEN"
```

### Esempio: JavaScript/Fetch

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rm-architettura.it',
      password: 'admin123'
    })
  });
  const data = await response.json();
  return data.token;
};

// Aggiungi spostamento
const addEntry = async (token) => {
  const response = await fetch('http://localhost:3000/api/carbon-footprint/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      date: '2024-05-16',
      transportMode: 'bike',
      distance: 5.5,
      isCommute: true
    })
  });
  return await response.json();
};
```

---

**Versione API**: 1.0.0  
**Ultimo Aggiornamento**: 16 Maggio 2024