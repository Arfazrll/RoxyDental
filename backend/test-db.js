const { Client } = require('pg');
require('dotenv').config();

console.log('Testing connection to:', process.env.DATABASE_URL);

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Supabase usually needs this or CA
});

client.connect()
    .then(() => {
        console.log('Connected successfully!');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
