const bcrypt = require('bcryptjs');

// Genera hash per la password admin123
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('\n=================================');
console.log('Password Hash Generator');
console.log('=================================\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nCopia questo hash nel file data/database.js alla riga 21\n');

// Test che l'hash funzioni
const isValid = bcrypt.compareSync(password, hash);
console.log('Verifica hash:', isValid ? '✅ Valido' : '❌ Non valido');
console.log('\n=================================\n');

// Made with Bob
