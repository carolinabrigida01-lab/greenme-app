# Guida all'Installazione - GreenMe App

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

### 1. Node.js e npm

**Verifica installazione:**
```bash
node --version  # Dovrebbe mostrare v14.x o superiore
npm --version   # Dovrebbe mostrare v6.x o superiore
```

**Se non installato, scarica da:**
- **macOS**: https://nodejs.org/it/download/ oppure usa Homebrew:
  ```bash
  brew install node
  ```
- **Windows**: https://nodejs.org/it/download/
- **Linux**: 
  ```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install nodejs npm
  
  # CentOS/RHEL
  sudo yum install nodejs npm
  ```

## Installazione Passo-Passo

### Passo 1: Preparazione del Progetto

```bash
# Naviga nella directory del progetto
cd Assignment-GreenMe

# Verifica che tutti i file siano presenti
ls -la
```

Dovresti vedere:
- `package.json`
- `server.js`
- `README.md`
- Directory: `data/`, `middleware/`, `routes/`, `public/`

### Passo 2: Installazione Dipendenze

```bash
npm install
```

Questo comando installerà tutte le dipendenze necessarie:
- express (server web)
- body-parser (parsing richieste)
- cors (gestione CORS)
- dotenv (variabili ambiente)
- bcryptjs (hashing password)
- jsonwebtoken (autenticazione JWT)
- multer (upload file)
- uuid (generazione ID)

**Tempo stimato**: 1-2 minuti

### Passo 3: Configurazione Ambiente

```bash
# Copia il file di esempio
cp .env.example .env

# Modifica il file .env con un editor
nano .env
# oppure
code .env
```

**Configurazioni importanti da modificare:**

```env
# IMPORTANTE: Cambia questo in produzione!
JWT_SECRET=il_tuo_secret_key_molto_sicuro_qui

# Porta del server (default: 3000)
PORT=3000

# Ambiente (development o production)
NODE_ENV=development
```

### Passo 4: Verifica Struttura Directory

Assicurati che esistano le directory per gli upload:

```bash
# Crea directory se non esistono
mkdir -p public/uploads/volunteering
```

### Passo 5: Avvio dell'Applicazione

**Modalità Sviluppo** (con auto-reload):
```bash
npm run dev
```

**Modalità Produzione**:
```bash
npm start
```

**Output atteso:**
```
🌱 GreenMe Server in esecuzione su http://localhost:3000
📊 Dashboard disponibile su http://localhost:3000
```

### Passo 6: Accesso all'Applicazione

1. Apri il browser
2. Vai su: **http://localhost:3000**
3. Usa le credenziali di default:
   - **Email**: `admin@rm-architettura.it`
   - **Password**: `admin123`

## Risoluzione Problemi Comuni

### Problema: "npm: command not found"

**Soluzione**: Node.js non è installato. Segui le istruzioni nella sezione Prerequisiti.

### Problema: "Port 3000 already in use"

**Soluzione 1**: Cambia porta nel file `.env`:
```env
PORT=3001
```

**Soluzione 2**: Trova e termina il processo sulla porta 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: "Cannot find module 'express'"

**Soluzione**: Le dipendenze non sono state installate correttamente:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: "EACCES: permission denied"

**Soluzione**: Problemi di permessi:
```bash
# macOS/Linux
sudo chown -R $USER:$USER .
npm install

# Oppure usa nvm (Node Version Manager)
```

### Problema: "Error: listen EADDRINUSE"

**Soluzione**: La porta è già in uso. Vedi "Port 3000 already in use" sopra.

### Problema: Login non funziona

**Verifica**:
1. Il server è in esecuzione?
2. Stai usando le credenziali corrette?
3. Controlla la console del browser (F12) per errori
4. Controlla i log del server nel terminale

## Test dell'Installazione

### Test 1: Verifica Server
```bash
curl http://localhost:3000/api/auth/login
```
Dovrebbe rispondere con un errore JSON (normale, mancano le credenziali).

### Test 2: Verifica Frontend
Apri http://localhost:3000 nel browser. Dovresti vedere la schermata di login.

### Test 3: Test Login
1. Vai su http://localhost:3000
2. Inserisci: `admin@rm-architettura.it` / `admin123`
3. Dovresti vedere la dashboard

### Test 4: Test API
```bash
# Login e ottieni token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rm-architettura.it","password":"admin123"}'
```

## Configurazione per Produzione

### 1. Variabili Ambiente

Modifica `.env` per produzione:
```env
NODE_ENV=production
JWT_SECRET=un_secret_molto_lungo_e_casuale_per_produzione
PORT=3000
```

### 2. Usa un Process Manager

**PM2** (consigliato):
```bash
# Installa PM2 globalmente
npm install -g pm2

# Avvia l'app
pm2 start server.js --name greenme

# Configura auto-start
pm2 startup
pm2 save

# Comandi utili
pm2 status        # Stato applicazioni
pm2 logs greenme  # Visualizza log
pm2 restart greenme  # Riavvia
pm2 stop greenme  # Ferma
```

### 3. Reverse Proxy con Nginx

Esempio configurazione Nginx:
```nginx
server {
    listen 80;
    server_name greenme.rm-architettura.it;

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

### 4. SSL/HTTPS con Let's Encrypt

```bash
# Installa certbot
sudo apt install certbot python3-certbot-nginx

# Ottieni certificato
sudo certbot --nginx -d greenme.rm-architettura.it
```

## Database Persistente (Opzionale)

L'app usa un database in-memory. Per produzione, considera:

### PostgreSQL
```bash
npm install pg
```

### MongoDB
```bash
npm install mongodb mongoose
```

Modifica `data/database.js` per usare un database reale.

## Backup e Manutenzione

### Backup Dati
```bash
# Se usi database in-memory, i dati si perdono al riavvio
# Implementa export/import o usa database persistente
```

### Log
```bash
# Con PM2
pm2 logs greenme

# Rotazione log
pm2 install pm2-logrotate
```

### Aggiornamenti
```bash
# Aggiorna dipendenze
npm update

# Verifica vulnerabilità
npm audit
npm audit fix
```

## Supporto

Per problemi o domande:
1. Controlla questo documento
2. Leggi il README.md
3. Controlla i log del server
4. Contatta: support@rm-architettura.it

## Checklist Post-Installazione

- [ ] Node.js e npm installati
- [ ] Dipendenze installate (`npm install`)
- [ ] File `.env` configurato
- [ ] Directory uploads creata
- [ ] Server avviato con successo
- [ ] Login funzionante
- [ ] Dashboard accessibile
- [ ] Password admin cambiata (produzione)
- [ ] JWT_SECRET cambiato (produzione)
- [ ] Backup configurato (produzione)
- [ ] SSL configurato (produzione)
- [ ] Process manager configurato (produzione)

## Prossimi Passi

Dopo l'installazione:
1. Cambia la password dell'admin
2. Crea account per i dipendenti
3. Configura le sfide
4. Personalizza i badge
5. Testa tutte le funzionalità
6. Forma gli utenti

---

**Buon lavoro con GreenMe!** 🌱