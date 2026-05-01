const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

// Import your bot commands from wolf.js
const wolf = require('./wolf');

const client = new Client({
    authStrategy: new LocalAuth()
});

// Show QR code
client.on('qr', (qr) => {
    console.log('Scan this QR code:');
    qrcode.generate(qr, { small: true });
});

// Bot is ready
client.on('ready', () => {
    console.log('✅ Bot is online!');
});

// Handle messages
client.on('message', async (message) => {
    await wolf.handleMessage(client, message);
});

// Start bot
client.initialize();
