
const bcrypt = require('bcryptjs');
bcrypt.hash('password123', 10).then(h => console.log('HASH:', h));
