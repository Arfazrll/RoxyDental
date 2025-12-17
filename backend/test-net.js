const net = require('net');

const HOST = 'aws-1-ap-southeast-1.pooler.supabase.com';
const PORT = 6543;

console.log(`Testing TCP connection to ${HOST}:${PORT}...`);

const socket = new net.Socket();
socket.setTimeout(10000); // 10s timeout

socket.on('connect', () => {
    console.log('✅ TCP Connection SUCCESS!');
    socket.end();
});

socket.on('timeout', () => {
    console.log('❌ Connection TIMEOUT (Firewall/Network Block)');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log(`❌ Connection ERROR: ${err.message}`);
});

socket.connect(PORT, HOST);
