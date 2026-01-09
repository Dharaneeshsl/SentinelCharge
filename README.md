# 🛡️ Laptop Battery Guardian (n8n + Node.js)

A **local-first laptop safety automation** that monitors battery status, kills heavy apps during low battery events, sends mobile alerts, and logs everything for analysis — powered by **Node.js + n8n**.

---

## 🚀 What This Project Does

This system continuously monitors your laptop’s battery state and automatically reacts when the battery becomes critical.

### Core Capabilities

* 🔋 Monitor real battery percentage (local system)
* ⚠️ Detect low-battery conditions
* 🛑 Kill resource-heavy applications safely
* 📲 Send Telegram alerts to your phone
* 📊 Log all details to Google Sheets
* 🧠 Prevent repeated actions with cooldown logic
* 🔐 No cloud dependency for system control

---
Executed Workflow
<img width="1322" height="540" alt="image" src="https://github.com/user-attachments/assets/0ab3acde-4233-46df-95ce-632ef2a4fe77" />


## 🧱 Architecture

```
┌──────────────┐
│ Laptop OS    │
│ (Windows)    │
└──────┬───────┘
       │
       │ systeminformation
       ▼
┌────────────────────┐
│ battery-server.js  │  (Port 3000)
│ /status endpoint   │
└────────┬───────────┘
         │ HTTP
         ▼
┌────────────────────┐
│ n8n Workflow       │
│ - IF logic         │
│ - Notifications    │
│ - Logging          │
└────────┬───────────┘
         │ HTTP
         ▼
┌────────────────────┐
│ kill-apps.js       │  (Port 3001)
│ /kill endpoint     │
└────────────────────┘
```

### Why this architecture is GOOD

* n8n **never touches hardware directly**
* System control stays **local & isolated**
* Automation logic stays **visual & auditable**
* Safer than running scripts inside n8n

---

## 📁 Project Structure

```
laptop-battery-guardian/
│
├── battery-server.js     # Battery telemetry service
├── kill-apps.js          # Safe app killer with cooldown
├── n8n-workflow.json     # Importable n8n workflow
└── README.md
```

---

## 🔋 battery-server.js (Telemetry Service)

Provides real battery data using `systeminformation`.

### Endpoint

```
GET http://localhost:3000/status
```

### Response

```json
{
  "percent": 27,
  "isCharging": false,
  "hasBattery": true,
  "timestamp": "2026-01-10T01:23:45.000Z"
}
```

### Why this matters

* Simple JSON
* n8n-friendly
* Works fully offline

---

## 🛑 kill-apps.js (Action Service)

Kills selected heavy applications **only when needed**, with a built-in cooldown.

### Endpoint

```
GET http://localhost:3001/kill
```

### Safety Features

* ⏱️ 10-minute cooldown
* 🔒 Whitelisted apps only
* ❌ No system processes touched
* 📜 Logs actions to console

### Example Response

```json
{
  "status": "executed",
  "killed": ["chrome.exe", "spotify.exe", "Code.exe"],
  "time": "2026-01-10T01:30:12.000Z"
}
```

---

## 🤖 n8n Workflow Logic

### Trigger

* **Schedule Trigger** (every 5 minutes)

### Flow

1. Fetch battery status from `/status`
2. IF battery `< 30%`

   * Call `/kill`
   * Send Telegram alert
   * Log event to Google Sheets
3. ELSE
   * Do nothing
   * Logs details to Google Sheets

### IF Condition Used

```js
Number($json.percent) < 30
```

---

## 📊 Google Sheets Schema

Sheet name: `BatteryLog`

| Column | Name           |
| ------ | -------------- |
| A      | Timestamp      |
| B      | BatteryPercent |
| C      | Charging       |
| D      | Current Time   |         |

### Example Row

```
2026-01-10T01:30:12Z | 27 | false | KILL_APPS | BATTERY_LOW | LAPTOP-WIN
```

---

## 📲 Telegram Alerts

Example message:

```
⚠️ Laptop Battery Alert
Battery: 27%
Charging: false
Action: Heavy apps terminated
```

This ensures you always **know what happened and why**.

---

## 🔐 Security & Safety Notes

✔️ No admin privileges required
✔️ No cloud control of hardware
✔️ No background crypto / hidden actions
✔️ Explicit cooldown to avoid abuse
✔️ Fully auditable logs

This behaves like **defensive automation**, not malware.

### What makes it unique

* n8n used for **device self-preservation**
* Local-first automation
* Separation of concerns (telemetry vs actions)
* Real-world usefulness (not a demo)

---

## 🔜 Future Improvements (Optional)

* Temperature-based triggers
* Auto-hibernate endpoint
* Webhook-based instant triggering
* Emergency workspace snapshot (tabs/screenshots)
* Dashboard charts from Sheets
