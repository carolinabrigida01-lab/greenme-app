# 🚀 Deploy GreenMe su Render.com - Guida Passo-Passo

## ✅ Preparazione Completata

Il repository Git è stato inizializzato e tutti i file sono stati committati.

---

## 📋 Passi per il Deployment

### Passo 1: Crea Account GitHub (se non ce l'hai)

1. Vai su [github.com](https://github.com)
2. Clicca "Sign up"
3. Completa la registrazione

### Passo 2: Crea Nuovo Repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Compila:
   - **Repository name**: `greenme-app`
   - **Description**: `GreenMe - Employee Sustainability & Volunteering App`
   - **Visibility**: Public (o Private se preferisci)
   - ⚠️ **NON** selezionare "Add a README file"
   - ⚠️ **NON** selezionare ".gitignore" o "license"
3. Clicca "Create repository"

### Passo 3: Collega Repository Locale a GitHub

GitHub ti mostrerà dei comandi. Copia l'URL del tuo repository (sarà tipo: `https://github.com/tuousername/greenme-app.git`)

Poi esegui nel terminale:

```bash
cd /Users/cbrigida91/Documents/Assignment-GreenMe

# Collega il repository remoto (sostituisci con il TUO URL)
git remote add origin https://github.com/TUOUSERNAME/greenme-app.git

# Verifica
git remote -v

# Push del codice
git branch -M main
git push -u origin main
```

**Nota**: Ti chiederà username e password GitHub. Per la password, usa un **Personal Access Token**:
- Vai su GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token → Seleziona "repo" → Generate
- Copia il token e usalo come password

### Passo 4: Crea Account Render

1. Vai su [render.com](https://render.com)
2. Clicca "Get Started"
3. Registrati con GitHub (consigliato) o email

### Passo 5: Crea Web Service su Render

1. Nel dashboard Render, clicca **"New +"** in alto a destra
2. Seleziona **"Web Service"**
3. Clicca **"Connect account"** per GitHub (se non già fatto)
4. Autorizza Render ad accedere ai tuoi repository
5. Trova e seleziona il repository **"greenme-app"**
6. Clicca **"Connect"**

### Passo 6: Configura il Web Service

Compila i campi:

**Basic Settings:**
- **Name**: `greenme-app` (o un nome a tua scelta)
- **Region**: `Frankfurt (EU Central)` (più vicino all'Italia)
- **Branch**: `main`
- **Root Directory**: (lascia vuoto)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Plan:**
- Seleziona **"Free"** (0$/mese)

### Passo 7: Aggiungi Variabili Ambiente

Scorri in basso fino a **"Environment Variables"** e clicca **"Add Environment Variable"**

Aggiungi queste variabili (una alla volta):

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `greenme_jwt_secret_2024_rm_architettura_pavia_secure_key_123456789`

3. **PORT**
   - Key: `PORT`
   - Value: `3000`

4. **APP_NAME**
   - Key: `APP_NAME`
   - Value: `GreenMe`

5. **COMPANY_NAME**
   - Key: `COMPANY_NAME`
   - Value: `RM Architettura e Consulenza Bandi`

### Passo 8: Deploy!

1. Clicca **"Create Web Service"** in fondo alla pagina
2. Render inizierà automaticamente il build e deploy
3. Vedrai i log in tempo reale

**Tempo stimato**: 2-3 minuti

### Passo 9: Ottieni il Tuo URL Pubblico

Una volta completato il deploy (vedrai "Live" in verde):

1. In alto vedrai l'URL del tuo sito, tipo:
   ```
   https://greenme-app.onrender.com
   ```
   oppure
   ```
   https://greenme-app-xxxx.onrender.com
   ```

2. Clicca sull'URL per aprire l'app!

---

## 🎉 Congratulazioni!

La tua app è ora **PUBBLICA** e accessibile da chiunque su internet!

### 🔑 Credenziali di Accesso

- **URL**: Il tuo URL Render (vedi sopra)
- **Email**: `admin@rm-architettura.it`
- **Password**: `admin123`

### 📱 Condividi l'App

Puoi condividere l'URL con:
- Colleghi
- Clienti
- Stakeholder
- Chiunque!

L'app è:
- ✅ Accessibile 24/7
- ✅ Con HTTPS/SSL automatico
- ✅ Gratuita
- ✅ Con uptime 99.9%

---

## 🔧 Gestione Post-Deployment

### Visualizzare Log

1. Nel dashboard Render
2. Clicca sul tuo servizio "greenme-app"
3. Vai su tab "Logs"

### Riavviare il Servizio

1. Nel dashboard Render
2. Clicca sul tuo servizio
3. Clicca "Manual Deploy" → "Clear build cache & deploy"

### Aggiornare il Codice

Ogni volta che fai push su GitHub, Render farà automaticamente il re-deploy:

```bash
# Modifica i file
git add .
git commit -m "Descrizione modifiche"
git push origin main
```

Render rileverà il push e aggiornerà automaticamente l'app!

### Cambiare Variabili Ambiente

1. Dashboard Render → Il tuo servizio
2. Tab "Environment"
3. Modifica o aggiungi variabili
4. Clicca "Save Changes"
5. Il servizio si riavvierà automaticamente

---

## ⚠️ Note Importanti

### Piano Gratuito Render

- ✅ Completamente gratuito
- ✅ SSL/HTTPS incluso
- ✅ 750 ore/mese (più che sufficienti)
- ⚠️ Il servizio va in "sleep" dopo 15 minuti di inattività
- ⚠️ Primo accesso dopo sleep: 30-60 secondi di attesa
- ⚠️ Database in-memory: i dati si perdono al riavvio

### Mantenere il Servizio Sempre Attivo

**Opzione 1**: Upgrade a piano a pagamento ($7/mese)

**Opzione 2**: Usa un servizio di "ping" gratuito:
- [UptimeRobot](https://uptimerobot.com) - Ping ogni 5 minuti
- [Cron-job.org](https://cron-job.org) - Ping schedulato

### Database Persistente (Opzionale)

Per dati permanenti, aggiungi PostgreSQL:

1. Dashboard Render → "New +" → "PostgreSQL"
2. Name: `greenme-db`
3. Plan: Free
4. Create Database
5. Copia "Internal Database URL"
6. Aggiungi variabile ambiente al Web Service:
   - Key: `DATABASE_URL`
   - Value: [URL copiato]
7. Modifica `data/database.js` per usare PostgreSQL

---

## 🆘 Troubleshooting

### Build Fallisce

**Errore**: `npm install` fallisce
**Soluzione**: Verifica `package.json` sia corretto

### App Non Si Avvia

**Errore**: "Application failed to respond"
**Soluzione**: 
- Verifica variabile `PORT` sia impostata
- Controlla log per errori

### 502 Bad Gateway

**Causa**: Servizio in sleep o riavvio
**Soluzione**: Aspetta 30-60 secondi e ricarica

### Login Non Funziona

**Causa**: JWT_SECRET non impostato
**Soluzione**: Verifica variabili ambiente

---

## 📞 Supporto

- **Documentazione Render**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)

---

## 🎯 Prossimi Passi Consigliati

1. ✅ Testa tutte le funzionalità online
2. ✅ Cambia password admin
3. ✅ Crea account per dipendenti
4. ✅ Configura database PostgreSQL (opzionale)
5. ✅ Aggiungi dominio personalizzato (opzionale)
6. ✅ Configura backup automatici

---

**Buon deployment!** 🚀

Se hai problemi, consulta la sezione Troubleshooting o contatta il supporto Render.