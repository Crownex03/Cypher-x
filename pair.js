const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const PORT = 3000;

// This stores pairing codes temporarily
const pendingPairs = new Map();

// Serve a simple HTML page for pairing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WhatsApp Bot - Pair Device</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        input, button { padding: 10px; margin: 10px; font-size: 16px; }
        button { background: green; color: white; border: none; cursor: pointer; }
        #result { margin-top: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🤖 Connect to WhatsApp Bot</h1>
      <p>Enter your phone number to get a pairing code:</p>
      <input type="text" id="phone" placeholder="Example: 254712345678" />
      <button onclick="pairDevice()">Get Pairing Code</button>
      <div id="result"></div>

      <script>
        async function pairDevice() {
          const phone = document.getElementById('phone').value;
          const resultDiv = document.getElementById('result');
          
          if (!phone) {
            resultDiv.innerHTML = '❌ Please enter a phone number';
            return;
          }
          
          resultDiv.innerHTML = '⏳ Requesting pairing code...';
          
          const response = await fetch('/pair', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone })
          });
          
          const data = await response.json();
          
          if (data.success) {
            resultDiv.innerHTML = \`✅ Pairing code: <strong>\${data.code}</strong><br>
            Open WhatsApp > Settings > Linked Devices > Link with phone number<br>
            Enter this code: \${data.code}\`;
          } else {
            resultDiv.innerHTML = '❌ Error: ' + data.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// API endpoint to request pairing code
app.post('/pair', async (req, res) => {
  let phoneNumber = req.body.phoneNumber;
  
  // Clean the phone number (remove +, spaces, etc.)
  phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
  
  if (!phoneNumber || phoneNumber.length < 10) {
    return res.json({ success: false, message: 'Invalid phone number' });
  }
  
  try {
    // Create a temporary client just for pairing
    const tempClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true }
    });
    
    let pairingCode = null;
    
    // Listen for the pairing code
    tempClient.on('code', (code) => {
      pairingCode = code;
      console.log(`Pairing code for ${phoneNumber}: ${code}`);
    });
    
    // Initialize and request pairing
    await tempClient.initialize();
    
    // Request pairing code (using built-in method)
    // Note: whatsapp-web.js v1.24+ supports this
    await tempClient.requestPairingCode(phoneNumber);
    
    // Wait for code to be generated (max 30 seconds)
    for (let i = 0; i < 30; i++) {
      if (pairingCode) break;
      await new Promise(r => setTimeout(r, 1000));
    }
    
    if (pairingCode) {
      res.json({ success: true, code: pairingCode });
    } else {
      res.json({ success: false, message: 'Could not generate code. Try again.' });
    }
    
    // Close temp client after 2 minutes
    setTimeout(() => tempClient.destroy(), 120000);
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌐 Pairing page available at: http://localhost:${PORT}`);
  console.log(`📱 Open this URL in your browser`);
});
