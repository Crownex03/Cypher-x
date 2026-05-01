// All your bot commands go here

async function handleMessage(client, message) {
    const body = message.body;
    
    // Ignore messages from bot itself
    if (message.fromMe) return;
    
    // Command: !ping
    if (body === '!ping') {
        await message.reply('🏓 Pong!');
    }
    
    // Command: !hello
    if (body === '!hello') {
        await message.reply('Hello! 👋 How can I help you?');
    }
    
    // Command: !time
    if (body === '!time') {
        const now = new Date();
        await message.reply(`🕐 Current time: ${now.toLocaleTimeString()}`);
    }
    
    // Command: !help
    if (body === '!help') {
        await message.reply(
            '📚 *Available Commands:*\n\n' +
            '!ping - Check if bot is alive\n' +
            '!hello - Say hello to bot\n' +
            '!time - Get current time\n' +
            '!help - Show this menu'
        );
    }
    
    // Command: !sticker (convert image to sticker)
    if (body === '!sticker' && message.hasMedia) {
        const media = await message.downloadMedia();
        await message.reply(media, undefined, { sendMediaAsSticker: true });
    }
}

module.exports = { handleMessage };
