// Bot is ready
client.on('ready', () => {
    console.log('✅ Bot is online!');
    
    // Listen for pairing codes (for number pairing method)
    client.on('code', (code) => {
        console.log(`📱 Pairing code received: ${code}`);
        console.log(`User can enter this code in WhatsApp to connect`);
    });
});
