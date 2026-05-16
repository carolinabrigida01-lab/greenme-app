# Guida al Deployment - GreenMe App

Questa guida spiega come rendere l'applicazione GreenMe accessibile pubblicamente su internet.

## Indice

- [Opzioni di Deployment](#opzioni-di-deployment)
- [Opzione 1: Render (Gratuito - Consigliato)](#opzione-1-render-gratuito---consigliato)
- [Opzione 2: Railway (Gratuito)](#opzione-2-railway-gratuito)
- [Opzione 3: Heroku (A Pagamento)](#opzione-3-heroku-a-pagamento)
- [Opzione 4: DigitalOcean (A Pagamento)](#opzione-4-digitalocean-a-pagamento)
- [Opzione 5: ngrok (Temporaneo - Test)](#opzione-5-ngrok-temporaneo---test)
- [Configurazione Database Persistente](#configurazione-database-persistente)
- [Configurazione SSL/HTTPS](#configurazione-sslhttps)

---

## Opzioni di Deployment

### Confronto Rapido

| Piattaforma | Costo | Difficoltà | Database | SSL | Uptime |
|-------------|-------|------------|----------|-----|--------|
| **Render** | Gratuito | Facile | PostgreSQL gratuito | ✅ | 99.9% |
| **Railway** | Gratuito (5$/mese dopo) | Facile | PostgreSQL incluso | ✅ | 99.9% |
| **Heroku** | $7/mese | Facile | PostgreSQL a pagamento | ✅ | 99.95% |
| **DigitalOcean** | $6/mese | Media | Separato | ✅ | 99.99% |
| **ngrok** | Gratuito (temporaneo) | Molto facile | Locale | ❌ | N/A |

---

## Opzione 1: Render (Gratuito - Consigliato)

**Vantaggi**: Completamente gratuito, facile da usare, SSL automatico, database PostgreSQL gratuito

### Passo 1: Preparazione

1. Crea un account su [render.com](https://render.com)
2. Installa Git se non lo hai già:
   ```bash
   git --version
   # Se non installato: brew install git (macOS) o scarica da git-scm.com
   ```

### Passo 2: Inizializza Repository Git

```bash
cd /Users/cbrigida91/Documents/Assignment-GreenMe

# Inizializza repository
git init

# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Initial commit - GreenMe App"
```

### Passo 3: Crea Repository su GitHub

1. Vai su [github.com](https://github.com) e crea un nuovo repository
2. Chiamalo `greenme-app`
3. NON inizializzare con README (lo abbiamo già)
4. Copia l'URL del repository (es: `https://github.com/tuousername/greenme-app.git`)

```bash
# Collega il repository remoto
git remote add origin https://github.com/tuousername/greenme-app.git

# Push del codice
git branch -M main
git push -u origin main
```

### Passo 4: Deploy su Render

1. Vai su [render.com/dashboard](https://dashboard.render.com)
2. Clicca su "New +" → "Web Service"
3. Connetti il tuo repository GitHub
4. Configura:
   - **Name**: `greenme-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Aggiungi variabili ambiente:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `un_secret_molto_lungo_e_casuale_123456789`
   - `PORT` = `3000`

6. Clicca su "Create Web Service"

### Passo 5: Attendi il Deploy

Render costruirà e avvierà l'app automaticamente. Dopo 2-3 minuti, avrai un URL tipo:
```
https://greenme-app.onrender.com
```

### Passo 6: Aggiungi Database PostgreSQL (Opzionale)

1. Nel dashboard Render, clicca "New +" → "PostgreSQL"
2. Nome: `greenme-db`
3. Plan: `Free`
4. Clicca "Create Database"
5. Copia l'URL del database
6. Aggiungi variabile ambiente al Web Service:
   - `DATABASE_URL` = `[URL copiato]`

---

## Opzione 2: Railway (Gratuito)

**Vantaggi**: Deploy con un comando, database incluso, $5 di credito gratuito al mese

### Passo 1: Installa Railway CLI

```bash
npm install -g @railway/cli
```

### Passo 2: Login

```bash
railway login
```

### Passo 3: Inizializza Progetto

```bash
cd /Users/cbrigida91/Documents/Assignment-GreenMe
railway init
```

### Passo 4: Deploy

```bash
railway up
```

### Passo 5: Aggiungi Database

```bash
railway add postgresql
```

### Passo 6: Ottieni URL

```bash
railway domain
```

Il tuo URL sarà tipo: `https://greenme-app.up.railway.app`

---

## Opzione 3: Heroku (A Pagamento)

**Costo**: $7/mese per dyno, database extra

### Passo 1: Installa Heroku CLI

```bash
brew tap heroku/brew && brew install heroku
```

### Passo 2: Login

```bash
heroku login
```

### Passo 3: Crea App

```bash
cd /Users/cbrigida91/Documents/Assignment-GreenMe
heroku create greenme-app
```

### Passo 4: Aggiungi Database

```bash
heroku addons:create heroku-postgresql:mini
```

### Passo 5: Configura Variabili

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=un_secret_molto_lungo_123456
```

### Passo 6: Deploy

```bash
git push heroku main
```

### Passo 7: Apri App

```bash
heroku open
```

---

## Opzione 4: DigitalOcean (A Pagamento)

**Costo**: $6/mese per droplet base

### Passo 1: Crea Droplet

1. Vai su [digitalocean.com](https://www.digitalocean.com)
2. Crea un Droplet Ubuntu 22.04
3. Scegli piano $6/mese
4. Aggiungi chiave SSH

### Passo 2: Connetti al Server

```bash
ssh root@your-droplet-ip
```

### Passo 3: Installa Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Passo 4: Clona Repository

```bash
cd /var/www
git clone https://github.com/tuousername/greenme-app.git
cd greenme-app
npm install
```

### Passo 5: Configura Ambiente

```bash
cp .env.example .env
nano .env
# Modifica le variabili
```

### Passo 6: Avvia con PM2

```bash
pm2 start server.js --name greenme
pm2 startup
pm2 save
```

### Passo 7: Configura Nginx

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/greenme
```

Aggiungi:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/greenme /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 8: Aggiungi SSL

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Opzione 5: ngrok (Temporaneo - Test)

**Vantaggi**: Immediato, nessuna configurazione, perfetto per demo
**Svantaggi**: URL cambia ad ogni riavvio, non per produzione

### Passo 1: Installa ngrok

```bash
brew install ngrok
# oppure scarica da https://ngrok.com/download
```

### Passo 2: Registrati

1. Vai su [ngrok.com](https://ngrok.com)
2. Crea account gratuito
3. Copia il token di autenticazione

### Passo 3: Configura Token

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Passo 4: Avvia l'App Localmente

```bash
cd /Users/cbrigida91/Documents/Assignment-GreenMe
npm start
```

### Passo 5: Crea Tunnel Pubblico

In un nuovo terminale:
```bash
ngrok http 3000
```

Otterrai un URL tipo:
```
https://abc123.ngrok.io
```

**Questo URL è accessibile pubblicamente da chiunque!**

### Passo 6: Condividi l'URL

Puoi condividere l'URL ngrok con chiunque. L'app sarà accessibile finché:
- Il tuo computer è acceso
- L'app Node.js è in esecuzione
- ngrok è attivo

**Nota**: Con account gratuito, l'URL cambia ogni volta che riavvii ngrok.

---

## Configurazione Database Persistente

L'app attualmente usa database in-memory. Per produzione, configura PostgreSQL:

### Installa Driver PostgreSQL

```bash
npm install pg
```

### Modifica database.js

Sostituisci il contenuto di `data/database.js` con connessione PostgreSQL:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Implementa funzioni CRUD con PostgreSQL
// ... (vedi documentazione PostgreSQL)
```

### Crea Tabelle

```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50),
  department VARCHAR(100),
  join_date DATE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_co2_saved DECIMAL(10,3) DEFAULT 0,
  total_volunteer_hours DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Altre tabelle...
```

---

## Configurazione SSL/HTTPS

### Con Render/Railway/Heroku
SSL è automatico e gratuito! ✅

### Con DigitalOcean/VPS
Usa Let's Encrypt (vedi Opzione 4, Passo 8)

### Con ngrok
Usa sempre HTTPS automaticamente ✅

---

## Checklist Post-Deployment

- [ ] App accessibile pubblicamente
- [ ] Login funzionante
- [ ] SSL/HTTPS attivo
- [ ] Database configurato (se necessario)
- [ ] Variabili ambiente configurate
- [ ] Password admin cambiata
- [ ] Backup configurato
- [ ] Monitoraggio attivo
- [ ] URL personalizzato (opzionale)

---

## Raccomandazioni

### Per Demo/Test Rapido
✅ **Usa ngrok** - Pronto in 2 minuti

### Per Produzione Gratuita
✅ **Usa Render** - Affidabile, gratuito, SSL incluso

### Per Produzione Professionale
✅ **Usa DigitalOcean + Database gestito** - Massimo controllo

---

## Supporto

Per problemi di deployment:
1. Controlla i log della piattaforma
2. Verifica variabili ambiente
3. Testa localmente prima
4. Consulta documentazione piattaforma

---

**Buon deployment!** 🚀