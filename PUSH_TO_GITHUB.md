# 🚀 Push Codice su GitHub - Istruzioni

## ✅ Preparazione Completata

- ✅ Repository collegato a: https://github.com/carolinabrigida01-lab/greenme-app
- ✅ Branch main configurato
- ✅ Codice pronto per il push

## 📋 Cosa Devi Fare Ora

### **Opzione 1: Push con Token (Consigliato)**

#### Passo 1: Crea Personal Access Token

1. Vai su GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Compila:
   - **Note**: `greenme-deploy`
   - **Expiration**: 90 days
   - **Scopes**: Seleziona ✅ **repo** (tutte le checkbox sotto)
4. Click **"Generate token"**
5. **COPIA IL TOKEN** (lo vedrai una sola volta!)

#### Passo 2: Push con Token

Apri il terminale ed esegui:

```bash
cd /Users/cbrigida91/Documents/Assignment-GreenMe

git push -u origin main
```

Quando richiesto:
- **Username**: `carolinabrigida01-lab`
- **Password**: [INCOLLA IL TOKEN QUI]

### **Opzione 2: Push con SSH (Alternativa)**

Se preferisci usare SSH:

```bash
# Cambia URL a SSH
git remote set-url origin git@github.com:carolinabrigida01-lab/greenme-app.git

# Push
git push -u origin main
```

### **Opzione 3: Push da GitHub Desktop (Più Facile)**

1. Scarica GitHub Desktop: https://desktop.github.com
2. Installa e fai login
3. File → Add Local Repository
4. Seleziona: `/Users/cbrigida91/Documents/Assignment-GreenMe`
5. Click "Publish repository"

---

## ✅ Verifica Push Completato

Dopo il push, vai su:
https://github.com/carolinabrigida01-lab/greenme-app

Dovresti vedere tutti i file del progetto!

---

## 🚀 Prossimo Passo: Deploy su Render

Una volta che il codice è su GitHub, segui questi passi per Render:

### 1. Crea Account Render

- Vai su: https://render.com
- Click **"Get Started"**
- Scegli **"Sign up with GitHub"**
- Autorizza Render

### 2. Crea Web Service

1. Dashboard Render → **"New +"** → **"Web Service"**
2. Click **"Connect account"** (se richiesto)
3. Trova **"greenme-app"** nella lista
4. Click **"Connect"**

### 3. Configura

**Name**: `greenme-app`

**Region**: `Frankfurt (EU Central)`

**Branch**: `main`

**Runtime**: `Node`

**Build Command**: `npm install`

**Start Command**: `npm start`

**Instance Type**: `Free`

### 4. Variabili Ambiente

Aggiungi queste variabili:

```
NODE_ENV = production
JWT_SECRET = greenme_jwt_secret_2024_rm_architettura_pavia_secure_key_123456789
PORT = 3000
APP_NAME = GreenMe
COMPANY_NAME = RM Architettura e Consulenza Bandi
```

### 5. Deploy!

Click **"Create Web Service"**

Attendi 2-3 minuti...

### 6. Ottieni URL

Il tuo URL sarà tipo:
```
https://greenme-app.onrender.com
```

**L'app sarà online e pubblica!** 🎉

---

## 🔑 Credenziali App

**Email**: `admin@rm-architettura.it`
**Password**: `admin123`

---

## 📞 Serve Aiuto?

Se hai problemi con il push:

1. **Token non funziona**: Verifica di aver selezionato "repo" scope
2. **SSH non funziona**: Usa Opzione 1 (Token)
3. **Altro**: Usa GitHub Desktop (Opzione 3)

---

**Segui questi passi e in 10 minuti l'app sarà online!** 🚀