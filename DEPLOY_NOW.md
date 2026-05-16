# 🚀 Deploy GreenMe su Render - GUIDA RAPIDA

## ✅ Preparazione Completata

- ✅ Repository Git inizializzato
- ✅ Codice committato (25 file)
- ✅ Login senza password configurato
- ✅ Pronto per il push

---

## 📋 PASSI DA SEGUIRE ORA

### **PASSO 1: Crea Account GitHub** (2 minuti)

1. Apri browser e vai su: **https://github.com/signup**
2. Inserisci:
   - Email
   - Password
   - Username (es: `rm-architettura` o il tuo nome)
3. Verifica email
4. Completa setup

### **PASSO 2: Crea Repository GitHub** (1 minuto)

1. Vai su: **https://github.com/new**
2. Compila:
   - **Repository name**: `greenme-app`
   - **Description**: `GreenMe - Employee Sustainability App`
   - **Visibility**: ✅ Public
   - ⚠️ **NON** selezionare "Add a README"
   - ⚠️ **NON** selezionare ".gitignore"
3. Clicca **"Create repository"**

### **PASSO 3: Collega Repository** (2 minuti)

GitHub ti mostrerà una pagina con comandi. Copia l'URL del repository (sarà tipo: `https://github.com/TUOUSERNAME/greenme-app.git`)

**Esegui questi comandi nel terminale:**

```bash
# Vai nella directory del progetto
cd /Users/cbrigida91/Documents/Assignment-GreenMe

# Collega il repository (SOSTITUISCI con il TUO URL!)
git remote add origin https://github.com/TUOUSERNAME/greenme-app.git

# Verifica connessione
git remote -v

# Push del codice
git push -u origin main
```

**Autenticazione GitHub:**
- Username: il tuo username GitHub
- Password: **USA UN TOKEN**, non la password normale!

**Come creare un Token:**
1. GitHub → Click tua foto profilo → Settings
2. Scroll in fondo → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Note: `greenme-deploy`
6. Expiration: 90 days
7. Seleziona: ✅ **repo** (tutte le checkbox sotto repo)
8. Generate token
9. **COPIA IL TOKEN** (lo vedrai una sola volta!)
10. Usa questo token come password quando fai `git push`

### **PASSO 4: Crea Account Render** (2 minuti)

1. Vai su: **https://render.com**
2. Clicca **"Get Started"**
3. Scegli **"Sign up with GitHub"** (più facile!)
4. Autorizza Render ad accedere a GitHub
5. Completa registrazione

### **PASSO 5: Deploy su Render** (3 minuti)

1. Nel dashboard Render, clicca **"New +"** (in alto a destra)
2. Seleziona **"Web Service"**
3. Clicca **"Connect account"** se richiesto
4. Trova il repository **"greenme-app"** nella lista
5. Clicca **"Connect"**

### **PASSO 6: Configura Web Service**

**Compila i campi:**

**Name**: `greenme-app`

**Region**: `Frankfurt (EU Central)` (più vicino all'Italia)

**Branch**: `main`

**Runtime**: `Node`

**Build Command**: `npm install`

**Start Command**: `npm start`

**Instance Type**: `Free`

### **PASSO 7: Aggiungi Variabili Ambiente**

Scorri fino a **"Environment Variables"** e aggiungi:

**Variabile 1:**
- Key: `NODE_ENV`
- Value: `production`

**Variabile 2:**
- Key: `JWT_SECRET`
- Value: `greenme_jwt_secret_2024_rm_architettura_pavia_secure_key_123456789`

**Variabile 3:**
- Key: `PORT`
- Value: `3000`

**Variabile 4:**
- Key: `APP_NAME`
- Value: `GreenMe`

**Variabile 5:**
- Key: `COMPANY_NAME`
- Value: `RM Architettura e Consulenza Bandi`

### **PASSO 8: Deploy!**

1. Clicca **"Create Web Service"** in fondo
2. Render inizierà il build automaticamente
3. Vedrai i log in tempo reale
4. Attendi 2-3 minuti

### **PASSO 9: Ottieni URL Pubblico!** 🎉

Una volta completato (vedrai "Live" in verde):

Il tuo URL sarà tipo:
```
https://greenme-app.onrender.com
```
oppure
```
https://greenme-app-xxxx.onrender.com
```

**Clicca sull'URL per aprire l'app!**

---

## 🎉 FATTO! L'APP È ONLINE!

### 🔑 Credenziali di Accesso

**URL**: Il tuo URL Render (vedi sopra)

**Login**:
- **Email**: `admin@rm-architettura.it`
- **Password**: `admin123` (richiesta in produzione)

### 📱 Condividi l'App

Ora puoi condividere l'URL con chiunque!

L'app è:
- ✅ Pubblica e accessibile 24/7
- ✅ Con HTTPS/SSL automatico
- ✅ Gratuita
- ✅ Con uptime 99.9%

---

## 🔧 Comandi Utili

### Aggiornare l'App

Ogni volta che modifichi il codice:

```bash
git add .
git commit -m "Descrizione modifiche"
git push origin main
```

Render farà automaticamente il re-deploy!

### Vedere i Log

1. Dashboard Render
2. Click sul servizio "greenme-app"
3. Tab "Logs"

### Riavviare il Servizio

1. Dashboard Render
2. Click sul servizio
3. "Manual Deploy" → "Clear build cache & deploy"

---

## ⚠️ Note Importanti

### Piano Gratuito Render

- ✅ Completamente gratuito
- ✅ SSL/HTTPS incluso
- ⚠️ Sleep dopo 15 min inattività
- ⚠️ Primo accesso dopo sleep: 30-60 sec
- ⚠️ Database in-memory: dati si perdono al riavvio

### Mantenere Attivo

Per evitare lo sleep, usa:
- **UptimeRobot** (https://uptimerobot.com) - Ping ogni 5 minuti
- Oppure upgrade a piano $7/mese

---

## 🆘 Problemi?

### "git push" chiede password

→ Usa un Personal Access Token (vedi Passo 3)

### Build fallisce su Render

→ Controlla log, verifica `package.json`

### App non si avvia

→ Verifica variabili ambiente, controlla log

### 502 Bad Gateway

→ Servizio in sleep, aspetta 30-60 sec

---

## 📞 Link Utili

- **GitHub**: https://github.com
- **Render**: https://render.com
- **Dashboard Render**: https://dashboard.render.com
- **Documentazione Render**: https://render.com/docs

---

## ✅ Checklist

- [ ] Account GitHub creato
- [ ] Repository GitHub creato
- [ ] Token GitHub generato
- [ ] Codice pushato su GitHub
- [ ] Account Render creato
- [ ] Web Service creato su Render
- [ ] Variabili ambiente configurate
- [ ] Deploy completato
- [ ] URL pubblico ottenuto
- [ ] Login testato
- [ ] URL condiviso

---

**Segui questi passi e in 15 minuti avrai l'app online!** 🚀

**Buon deployment!** 🌱