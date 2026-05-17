# 📊 Dati di Esempio - GreenMe App

## Panoramica

Il database è stato popolato con dati realistici per dimostrare tutte le funzionalità dell'applicazione GreenMe.

## 👥 Dipendenti (5 totali)

### 1. Mario Rossi (Admin)
- **Email**: admin@rm-architettura.it
- **Ruolo**: Amministratore
- **Dipartimento**: Direzione
- **Livello**: 3
- **Punti**: 2,850
- **CO2 Risparmiata**: 145.8 kg
- **Ore Volontariato**: 28.5 ore
- **Badge Ottenuti**: 2 (Green Commuter, Volontario del Mese)

### 2. Giulia Bianchi
- **Email**: giulia.bianchi@rm-architettura.it
- **Ruolo**: Dipendente
- **Dipartimento**: Architettura
- **Livello**: 2
- **Punti**: 1,920
- **CO2 Risparmiata**: 98.5 kg
- **Ore Volontariato**: 15.0 ore
- **Badge Ottenuti**: 1 (Green Commuter)

### 3. Luca Verdi
- **Email**: luca.verdi@rm-architettura.it
- **Ruolo**: Dipendente
- **Dipartimento**: Consulenza Bandi
- **Livello**: 2
- **Punti**: 1,650
- **CO2 Risparmiata**: 76.3 kg
- **Ore Volontariato**: 22.0 ore
- **Badge Ottenuti**: 1 (Volontario del Mese)

### 4. Sara Ferrari
- **Email**: sara.ferrari@rm-architettura.it
- **Ruolo**: Dipendente
- **Dipartimento**: Architettura
- **Livello**: 2
- **Punti**: 1,380
- **CO2 Risparmiata**: 62.1 kg
- **Ore Volontariato**: 18.5 ore
- **Badge Ottenuti**: 0

### 5. Marco Colombo
- **Email**: marco.colombo@rm-architettura.it
- **Ruolo**: Dipendente
- **Dipartimento**: Amministrazione
- **Livello**: 1
- **Punti**: 890
- **CO2 Risparmiata**: 38.2 kg
- **Ore Volontariato**: 12.0 ore
- **Badge Ottenuti**: 0

## 🚴 Tracciamento Carbon Footprint (18 entries)

### Modalità di Trasporto Utilizzate:
- **Bicicletta** (bike): 8 viaggi - 0 kg CO2 emessa
- **Treno** (train): 3 viaggi - Basse emissioni
- **Autobus** (bus): 4 viaggi - Emissioni moderate
- **Carpooling** (carpool): 2 viaggi - Emissioni ridotte
- **A piedi** (walk): 2 viaggi - 0 kg CO2 emessa
- **Auto** (car): 1 viaggio - Alte emissioni

### Statistiche Totali:
- **CO2 Totale Risparmiata**: ~421 kg
- **Distanza Totale Tracciata**: ~280 km
- **Punti Totali Guadagnati**: ~420 punti

## 🤝 Attività di Volontariato (9 attività)

### Tipologie di Attività:
1. **Pulizia Strade** (street_cleaning): 3 attività
2. **Piantumazione Aree Verdi** (green_planting): 2 attività
3. **Cura Decoro Urbano** (urban_decor): 1 attività
4. **Manutenzione Parchi** (park_maintenance): 1 attività
5. **Orto Comunitario** (community_garden): 1 attività
6. **Rimozione Graffiti** (graffiti_removal): 1 attività

### Località a Pavia:
- Piazza della Vittoria
- Parco della Vernavola
- Via Mentana
- Parco Visconteo
- Corso Cavour
- Quartiere Vallone
- Giardini Pubblici
- Centro Storico
- Parco Cittadella

### Statistiche Totali:
- **Ore Totali di Volontariato**: 36.0 ore
- **Attività Verificate**: 7 su 9
- **Punti Totali Guadagnati**: 1,825 punti

## 🏆 Badge e Gamification

### Badge Disponibili (5 totali):
1. **Eco Warrior** 🌍 - Riduci 100 kg di CO2 (500 punti)
2. **Green Commuter** 🚴 - Usa mezzi sostenibili per 30 giorni (300 punti)
3. **Volontario del Mese** 🤝 - Completa 20 ore di volontariato (400 punti)
4. **Guardiano della Città** 🏙️ - Partecipa a 10 attività urbane (350 punti)
5. **Pioniere Verde** ⭐ - Raggiungi livello 5 (1000 punti)

### Badge Assegnati (4 totali):
- Mario Rossi: 2 badge
- Giulia Bianchi: 1 badge
- Luca Verdi: 1 badge

### Sfide Attive (2):
1. **Settimana della Mobilità Sostenibile** - 4 partecipanti
2. **Puliamo Pavia** - 3 partecipanti

## 🔐 Credenziali di Accesso

**Tutti i dipendenti** possono accedere con:
- **Email**: [email del dipendente]
- **Password**: Non richiesta in modalità sviluppo (NODE_ENV !== 'production')

In modalità sviluppo, l'app effettua il login automatico come admin.

## 📈 Utilizzo dei Dati

Questi dati di esempio permettono di:
- ✅ Testare tutte le funzionalità dell'app
- ✅ Visualizzare una leaderboard realistica
- ✅ Vedere statistiche aggregate significative
- ✅ Dimostrare il sistema di gamification
- ✅ Mostrare diverse tipologie di attività
- ✅ Presentare report ESG con dati concreti

## 🔄 Reset dei Dati

Per ripristinare i dati originali:
```bash
mv data/database-backup.js data/database.js
npm start
```

Per ricaricare i dati di esempio:
```bash
mv data/database.js data/database-backup.js
mv data/database-with-sample-data.js data/database.js
npm start
```

## 📝 Note

- Tutti i dati sono fittizi ma realistici
- Le date sono relative alla data corrente
- Le coordinate GPS sono reali e si riferiscono a Pavia
- I calcoli di CO2 seguono i fattori di emissione configurati in `.env`
- Il sistema di punti e livelli è completamente funzionante