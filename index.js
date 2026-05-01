const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const wolf = require('./wolf');

const client = new Client({
    authStrategy: new LocalAuth()
});

// ========== METHOD 1: QR CODE SCANNING ==========
client.on('qr', (qr) => {
    console.log('========== METHOD 1: SCAN QR CODE ==========');
    console.log('Open WhatsApp > Linked Devices > Link a Device');
    console.log('Scan this QR code:');
    qrcode.generate(qr, { small: true });
    console.log('===========================================');
});

// ========== METHOD 2: PHONE NUMBER PAIRING ==========
client.on('ready', () => {
    console.log('✅ Bot is online and ready!');
    console.log('');
    console.log('========== BOTH PAIRING METHODS AVAILABLE ==========');
    console.log('METHOD 1: Scan the QR code above');
    console.log('METHOD 2: Send !pair 254712345678 to get pairing code');
    console.log('==================================================');
    console.log('');
    
    // Listen for pairing codes
    client.on('code', (code) => {
        console.log('📱 PAIRING CODE RECEIVED: ' + code);
        console.log('Tell user to open WhatsApp > Settings > Linked Devices');
        console.log('Then click "Link with phone number" and enter: ' + code);
        console.log('');
    });
});

// Handle messages (for command-based pairing)
client.on('message', async (message) => {
    // Check for !pair command
    if (message.body.startsWith('!pair')) {
        const args = message.body.split(' ');
        const phoneNumber = args[1];
        
        if (!phoneNumber) {
            await message.reply('❌ Usage: !pair 254712345678\n(Include your country code without +)');
            return;
        }
        
        // Clean the phone number
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        await message.reply(`⏳ Requesting pairing code for ${cleanNumber}...`);
        
        try {
            // Request pairing code
            await client.requestPairingCode(cleanNumber);
            await message.reply('✅ Pairing code requested! Check your WhatsApp app.');
        } catch (error) {
            await message.reply('❌ Failed to get pairing code. Try again.');
        }
        return;
    }
    
    // Handle normal bot commands from wolf.js
    await wolf.handleMessage(client, message);
});

// Start bot
client.initialize();
