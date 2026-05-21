# GreenMates - Employee Sustainability & Volunteering App

**Applicazione di Gamification per RM Architettura e Consulenza Bandi (Pavia)**

GreenMates è un'applicazione web innovativa progettata per misurare e incentivare comportamenti sostenibili e attività di volontariato tra i dipendenti, supportando la transizione dalla rendicontazione narrativa alla misurazione analitica tramite gamification.

## 📋 Indice

- [Caratteristiche Principali](#caratteristiche-principali)
- [Requisiti di Sistema](#requisiti-di-sistema)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Avvio dell'Applicazione](#avvio-dellapplicazione)
- [Struttura del Progetto](#struttura-del-progetto)
- [Moduli Funzionali](#moduli-funzionali)
- [API Endpoints](#api-endpoints)
- [Credenziali di Accesso](#credenziali-di-accesso)
- [Framework e Metodologie](#framework-e-metodologie)
- [Impatti Attesi](#impatti-attesi)

## 🌟 Caratteristiche Principali

### Modulo A: Carbon Footprint Individuale
- **Misurazione Analitica**: Tracciamento delle emissioni Scope 1, 2 e 3 correlate all'attività lavorativa
- **Monitoraggio Mobilità**: Registrazione degli spostamenti pendolari e professionali
- **Calcolo CO2**: Calcolo automatico delle emissioni basato sul mezzo di trasporto e distanza
- **Gamification**: Sistema di punti, badge e sfide per incentivare comportamenti sostenibili

### Modulo B: Rigenerazione Urbana e Volontariato
- **Time-Banking**: Tracciamento delle ore di volontariato attivo
- **Tipologie di Attività**: 
  - Pulizia strade
  - Piantumazione aree verdi
  - Cura del decoro urbano
  - Manutenzione parchi
  - Rimozione graffiti
  - Orti comunitari
- **Validazione**: Sistema di foto-validazione e geolocalizzazione
- **Verifica**: Processo di verifica amministrativa delle attività

### Sistema di Gamification
- **Punti e Livelli**: Sistema progressivo di punti e livelli
- **Badge**: 5 badge tematici con requisiti specifici
- **Sfide**: Sfide individuali e di team con premi
- **Classifica**: Leaderboard per punti, CO2 risparmiata e ore di volontariato

### Dashboard e Reporting
- **Dashboard Personale**: Panoramica delle attività e statistiche
- **Report ESG**: Generazione di report per conformità CSRD
- **Statistiche Aziendali**: Metriche aggregate per amministratori
- **Sustainability Balanced Scorecard**: Framework di monitoraggio integrato

## 💻 Requisiti di Sistema

- **Node.js**: versione 14.x o superiore
- **npm**: versione 6.x o superiore
- **Browser**: Chrome, Firefox, Safari o Edge (versioni recenti)
- **Sistema Operativo**: Windows, macOS o Linux

## 🚀 Installazione

1. **Clona o scarica il progetto**
   ```bash
   cd Assignment-GreenMe
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Crea il file di configurazione**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Configurazione

Modifica il file `.env` con le tue configurazioni:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (IMPORTANTE: Cambia in produzione!)
JWT_SECRET=your_secure_secret_key_here

# Application Settings
APP_NAME=GreenMates
COMPANY_NAME=RM Architettura e Consulenza Bandi
COMPANY_LOCATION=Pavia

# Carbon Footprint Constants (kg CO2 per km)
CO2_PER_KM_CAR=0.192
CO2_PER_KM_MOTORCYCLE=0.103
CO2_PER_KM_BUS=0.089
CO2_PER_KM_TRAIN=0.041
CO2_PER_KM_BIKE=0
CO2_PER_KM_WALK=0
CO2_PER_KWH_ELECTRICITY=0.233

# Gamification Settings
POINTS_PER_KG_CO2_SAVED=10
POINTS_PER_VOLUNTEER_HOUR=50
CHALLENGE_DURATION_DAYS=30
```

## 🎯 Avvio dell'Applicazione

### Modalità Sviluppo (con auto-reload)
```bash
npm run dev
```

### Modalità Produzione
```bash
npm start
```

L'applicazione sarà disponibile su: **http://localhost:3000**

## 📁 Struttura del Progetto

```
Assignment-GreenMe/
├── data/
│   └── database.js          # Database in-memory e gestione dati
├── middleware/
│   └── auth.js              # Middleware di autenticazione JWT
├── routes/
│   ├── auth.js              # Autenticazione e registrazione
│   ├── employees.js         # Gestione dipendenti
│   ├── carbonFootprint.js   # Modulo Carbon Footprint
│   ├── volunteering.js      # Modulo Volontariato
│   ├── gamification.js      # Badge, sfide e classifica
│   └── dashboard.js         # Dashboard e report ESG
├── public/
│   ├── index.html           # Frontend principale
│   ├── css/
│   │   └── style.css        # Stili dell'applicazione
│   ├── js/
│   │   └── app.js           # Logica frontend
│   └── uploads/
│       └── volunteering/    # Foto attività volontariato
├── server.js                # Server Express principale
├── package.json             # Dipendenze e script
├── .env.example             # Template configurazione
└── README.md                # Questa documentazione
```

## 🔧 Moduli Funzionali

### 1. Autenticazione
- Login con email e password
- JWT token per sessioni sicure
- Gestione ruoli (admin/employee)

### 2. Carbon Footprint
- Registrazione spostamenti con mezzo di trasporto
- Calcolo automatico CO2 emessa e risparmiata
- Statistiche mensili e confronti
- Percentuale trasporti sostenibili

### 3. Volontariato
- Registrazione attività con foto e geolocalizzazione
- Tracciamento ore per tipologia di attività
- Sistema di verifica amministrativa
- Statistiche e report

### 4. Gamification
- 5 badge tematici:
  - 🌍 Eco Warrior (100 kg CO2 risparmiata)
  - 🚴 Green Commuter (30 giorni sostenibili)
  - 🤝 Volontario del Mese (20 ore)
  - 🏙️ Guardiano della Città (10 attività urbane)
  - ⭐ Pioniere Verde (livello 5)
- Sfide temporali con premi
- Classifica multipla (punti, CO2, ore)

### 5. Dashboard
- Panoramica personale con statistiche
- Attività recenti
- Sfide attive
- Progressi mensili

### 6. Report ESG
- Scope 3 emissions (employee commuting)
- Social impact metrics
- Sustainability rate
- Employee engagement

## 🔌 API Endpoints

### Autenticazione
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrazione nuovo dipendente

### Dipendenti
- `GET /api/employees` - Lista dipendenti (admin)
- `GET /api/employees/profile` - Profilo utente
- `PUT /api/employees/profile` - Aggiorna profilo
- `GET /api/employees/stats` - Statistiche personali

### Carbon Footprint
- `POST /api/carbon-footprint/entries` - Aggiungi spostamento
- `GET /api/carbon-footprint/entries` - Lista spostamenti
- `GET /api/carbon-footprint/stats` - Statistiche CO2
- `GET /api/carbon-footprint/monthly-comparison` - Confronto mensile

### Volontariato
- `POST /api/volunteering/activities` - Aggiungi attività
- `GET /api/volunteering/activities` - Lista attività
- `GET /api/volunteering/stats` - Statistiche volontariato
- `GET /api/volunteering/activity-types` - Tipi di attività
- `GET /api/volunteering/all-activities` - Tutte le attività (admin)
- `PUT /api/volunteering/activities/:id/verify` - Verifica attività (admin)

### Gamification
- `GET /api/gamification/badges` - Lista badge
- `GET /api/gamification/my-badges` - Badge guadagnati
- `POST /api/gamification/check-badges` - Controlla nuovi badge
- `GET /api/gamification/challenges` - Lista sfide
- `POST /api/gamification/challenges/:id/join` - Iscriviti a sfida
- `GET /api/gamification/leaderboard` - Classifica
- `GET /api/gamification/my-rank` - Posizione personale

### Dashboard
- `GET /api/dashboard/overview` - Panoramica dashboard
- `GET /api/dashboard/company-stats` - Statistiche aziendali (admin)
- `GET /api/dashboard/esg-report` - Report ESG (admin)

## 🔑 Credenziali di Accesso

### Account Amministratore Predefinito
- **Email**: `admin@rm-architettura.it`
- **Password**: `admin123`

**IMPORTANTE**: Cambiare la password dopo il primo accesso in produzione!

### Creazione Nuovi Dipendenti
Gli amministratori possono creare nuovi account dipendenti tramite l'endpoint `/api/auth/register`.

## 📊 Framework e Metodologie

### Sustainability Balanced Scorecard (SBSC)
L'applicazione implementa il framework SBSC per il monitoraggio integrato della sostenibilità:
- **Prospettiva Ambientale**: Carbon footprint e riduzione emissioni
- **Prospettiva Sociale**: Volontariato e impatto territoriale
- **Prospettiva Economica**: Efficienza e ottimizzazione risorse
- **Prospettiva di Apprendimento**: Engagement e sviluppo competenze

### Digital Disclosure
- **Data Points Reali**: Geolocalizzazione, timestamp, foto-validazione
- **Tracciabilità**: Ogni attività è tracciata e verificabile
- **Eliminazione Asimmetrie**: Dati oggettivi vs. narrativa soggettiva

### Conformità CSRD
L'applicazione supporta la conformità alla Corporate Sustainability Reporting Directive:
- Misurazione Scope 3 (employee commuting)
- Metriche di impatto sociale
- Report standardizzati
- Audit trail completo

## 🎯 Impatti Attesi

### Quantitativi
- **Riduzione CO2**: 15-20% della footprint individuale
- **Efficienza**: Abbattimento tempi di reperimento dati per audit
- **Engagement**: Aumento partecipazione attività sostenibili

### Qualitativi
- **Employer Branding**: Rafforzamento dell'immagine aziendale
- **Coesione Team**: Miglioramento attraverso volontariato
- **Differenziazione**: Posizionamento come "Trailblazer" nel settore
- **Legittimità Organizzativa**: Consolidamento nel territorio

## 🛠️ Tecnologie Utilizzate

- **Backend**: Node.js, Express.js
- **Autenticazione**: JWT (JSON Web Tokens)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: In-memory database (facilmente sostituibile con PostgreSQL/MongoDB)
- **File Upload**: Multer
- **Security**: bcryptjs per password hashing

## 🔒 Sicurezza

- Password hashate con bcrypt
- JWT per autenticazione stateless
- Validazione input lato server
- Protezione CORS
- Limitazione dimensione file upload
- Sanitizzazione dati

## 📈 Sviluppi Futuri

- [ ] Integrazione database persistente (PostgreSQL/MongoDB)
- [ ] API per integrazione con sistemi esterni
- [ ] App mobile (React Native)
- [ ] Notifiche push
- [ ] Grafici e visualizzazioni avanzate
- [ ] Export report in PDF
- [ ] Integrazione con sistemi di geolocalizzazione
- [ ] Machine learning per suggerimenti personalizzati

## 🤝 Supporto

Per supporto tecnico o domande:
- **Email**: support@rm-architettura.it
- **Documentazione**: Questo README
- **Issues**: Segnalare problemi tramite il sistema di issue tracking

## 📄 Licenza

Proprietà di RM Architettura e Consulenza Bandi - Pavia
Tutti i diritti riservati.

## 👥 Crediti

Sviluppato per RM Architettura e Consulenza Bandi (Pavia)
Nell'ambito del progetto di innovazione di processo e sociale per la conformità CSRD e partecipazione a Bandi Europei.

---

**GreenMates** - Trasformare la sostenibilità in un gioco, misurare l'impatto reale. 🌱