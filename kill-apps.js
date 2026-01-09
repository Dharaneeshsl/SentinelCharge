// kill-apps.js
const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

const APPS = ["chrome.exe", "spotify.exe", "Code.exe"];
let lastKill = 0;
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

app.get('/kill', (req, res) => {
  const now = Date.now();

  if (now - lastKill < COOLDOWN_MS) {
    return res.json({
      status: "skipped",
      reason: "cooldown_active"
    });
  }

  lastKill = now;

  APPS.forEach(appName => {
    exec(`taskkill /IM ${appName} /F`, (err) => {
      if (err) {
        console.log(`Failed to kill ${appName}`);
      } else {
        console.log(`Killed ${appName}`);
      }
    });
  });

  res.json({
    status: "executed",
    killed: APPS,
    time: new Date().toISOString()
  });
});

app.listen(PORT, () =>
  console.log(`Kill-apps server running on http://localhost:${PORT}/kill`)
);
