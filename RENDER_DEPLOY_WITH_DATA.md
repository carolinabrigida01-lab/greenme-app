# 🚀 Deploy su Render.com con Dati di Esempio

## ✅ Modifiche Completate

Il codice è stato aggiornato per **auto-inizializzare i dati di esempio ad ogni avvio del server**.

### Cosa è stato fatto:
1. ✅ Database configurato per caricare automaticamente 5 dipendenti
2. ✅ 18 tracciamenti carbon footprint precaricati
3. ✅ 9 attività di volontariato con località reali di Pavia
4. ✅ Sistema di badge e sfide attivo
5. ✅ Log di conferma nel server per verificare il caricamento dati

### Come funziona:
Quando il server si avvia (anche su Render), il file `data/database.js` esegue automaticamente la funzione `initializeDatabase()` che popola il database in-memory con tutti i dati di esempio.

---

## 📋 Passi per Deploy su Render.com

### 1️⃣ Crea Account Render

1. Vai su: **https://render.com**
2. Click **"Get Started"**
3. Scegli **"Sign up with GitHub"**
4. Autorizza Render ad accedere al tuo account GitHub

### 2️⃣ Crea Nuovo Web Service

1. Nella Dashboard Render, click **"New +"** in alto a destra
2. Seleziona **"Web Service"**
3. Click **"Connect account"** se richiesto
4. Trova **"greenme-app"** nella lista dei repository
5. Click **"Connect"** accanto a greenme-app

### 3️⃣ Configura il Web Service

Compila i seguenti campi:

**Name**: `greenme-app`

**Region**: `Frankfurt (EU Central)` (più vicino all'Italia)

**Branch**: `main`

**Root Directory**: (lascia vuoto)

**Runtime**: `Node`

**Build Command**: 
```
npm install
```

**Start Command**: 
```
npm start
```

**Instance Type**: `Free`

### 4️⃣ Aggiungi Variabili d'Ambiente

Scorri in basso fino a **"Environment Variables"** e aggiungi:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `greenme_jwt_secret_2024_rm_architettura_pavia_secure_key_123456789` |
| `PORT` | `3000` |
| `APP_NAME` | `GreenMe` |
| `COMPANY_NAME` | `RM Architettura e Consulenza Bandi` |

**IMPORTANTE**: In modalità production, la password per il login sarà richiesta. Usa:
- Email: `admin@rm-architettura.it`
- Password: `admin123`

### 5️⃣ Deploy!

1. Click **"Create Web Service"** in fondo alla pagina
2. Render inizierà automaticamente il build e deploy
3. Attendi 2-3 minuti mentre Render:
   - Clona il repository
   - Installa le dipendenze
   - Avvia il server

### 6️⃣ Verifica il Deploy

Quando il deploy è completato:

1. Vedrai **"Live"** con un pallino verde
2. Troverai l'URL pubblico in alto, tipo:
   ```
   https://greenme-app.onrender.com
   ```
3. Click sull'URL per aprire l'app

### 7️⃣ Verifica i Dati di Esempio

Nei **Logs** di Render dovresti vedere:
```
🌱 GreenMe Server in esecuzione su http://localhost:3000
📊 Dashboard disponibile su http://localhost:3000
👥 Database inizializzato con 5 dipendenti
🚴 18 tracciamenti carbon footprint
🤝 9 attività di volontariato
🏆 5 badge disponibili
```

Se vedi questi log, **i dati di esempio sono stati caricati correttamente!** ✅

---

## 🔐 Accesso all'App

### In Produzione (Render):
- **Email**: `admin@rm-architettura.it`
- **Password**: `admin123`

### Altri Dipendenti di Test:
- `giulia.bianchi@rm-architettura.it` - Password: `admin123`
- `luca.verdi@rm-architettura.it` - Password: `admin123`
- `sara.ferrari@rm-architettura.it` - Password: `admin123`
- `marco.colombo@rm-architettura.it` - Password: `admin123`

---

## 📊 Cosa Vedrai nell'App

### Dashboard:
- **5 dipendenti** nella leaderboard
- **Statistiche aggregate** di CO2 risparmiata e ore volontariato
- **Grafici** con dati reali degli ultimi giorni
- **Badge** già assegnati ad alcuni dipendenti
- **Sfide attive** con partecipanti

### Sezione Carbon Footprint:
- 18 tracciamenti di esempio
- Varie modalità di trasporto (bici, treno, bus, carpooling, auto, a piedi)
- Calcoli CO2 realistici

### Sezione Volontariato:
- 9 attività in località reali di Pavia
- Foto placeholder (puoi aggiungerne di nuove)
- Alcune attività già verificate

---

## 🔄 Aggiornamenti Automatici

Render è configurato per **auto-deploy**:
- Ogni volta che fai `git push` su GitHub
- Render rileva le modifiche
- Ricompila e rideploya automaticamente
- I dati di esempio vengono ricaricati ad ogni deploy

---

## ⚠️ Limitazioni Piano Gratuito Render

- **Sleep dopo 15 minuti** di inattività
- Primo accesso dopo sleep: ~30 secondi di attesa
- **750 ore/mese** di uptime (sufficiente per demo)
- Database in-memory: **i dati si resettano ad ogni riavvio** (ma vengono ricaricati automaticamente)

### Soluzione per Dati Persistenti:
Se vuoi che i dati inseriti dagli utenti persistano tra i riavvii, dovrai:
1. Integrare un database reale (MongoDB Atlas, PostgreSQL)
2. Modificare il codice per usare il database esterno
3. I dati di esempio verranno caricati solo al primo avvio

---

## 🐛 Troubleshooting

### L'app non mostra i dati di esempio:

1. **Controlla i Logs** su Render:
   - Dashboard → Il tuo servizio → "Logs"
   - Cerca i messaggi di inizializzazione database
   - Verifica che non ci siano errori

2. **Verifica le variabili d'ambiente**:
   - Assicurati che `NODE_ENV=production` sia impostato
   - Controlla che `JWT_SECRET` sia configurato

3. **Riavvia il servizio**:
   - Dashboard → Il tuo servizio → "Manual Deploy" → "Clear build cache & deploy"

### L'app va in sleep:

- È normale per il piano gratuito
- Primo accesso dopo sleep: attendi 30 secondi
- Per evitarlo: usa un servizio di ping (es. UptimeRobot)

### Errori di autenticazione:

- In produzione la password è **obbligatoria**
- Usa: `admin123` per tutti gli account di test
- Se non funziona, verifica che `NODE_ENV=production` sia impostato

---

## 🎉 Deploy Completato!

Una volta completati questi passi, la tua app GreenMe sarà:
- ✅ **Online e pubblica** su un URL Render
- ✅ **Popolata con dati di esempio** realistici
- ✅ **Pronta per la demo** con 5 dipendenti e attività
- ✅ **Auto-aggiornata** ad ogni push su GitHub

**URL della tua app**: `https://greenme-app.onrender.com`

Condividi questo URL per mostrare l'applicazione! 🚀

---

## 📞 Supporto

Se hai problemi:
1. Controlla i **Logs** su Render
2. Verifica che il codice sia aggiornato su GitHub
3. Riavvia il servizio con "Clear build cache & deploy"
4. Consulta la documentazione: `README.md`, `DEPLOYMENT_GUIDE.md`

---

**Buon Deploy! 🌱**