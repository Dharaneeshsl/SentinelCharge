// battery-server.js
const express = require('express');
const si = require('systeminformation');

const app = express();
const PORT = 3000;

app.get('/status', async (req, res) => {
  try {
    const battery = await si.battery();

    res.json({
      percent: battery.hasBattery ? battery.percent : null,
      isCharging: battery.isCharging,
      hasBattery: battery.hasBattery,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Battery server running at http://localhost:${PORT}/status`)
);
