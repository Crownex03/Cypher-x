if (body === '!help') {
    await message.reply(
        '📚 *Available Commands:*\n\n' +
        '!ping - Check if bot is alive\n' +
        '!hello - Say hello to bot\n' +
        '!time - Get current time\n' +
        '!help - Show this menu\n' +
        '!pair [number] - Get pairing code\n\n' +
        '*How to pair:*\n' +
        '1️⃣ Send: !pair 254712345678\n' +
        '2️⃣ Get 8-digit code\n' +
        '3️⃣ WhatsApp > Settings > Linked Devices\n' +
        '4️⃣ Link with phone number'
    );
}
