# 📚 Study Timer

A clean, distraction-free desktop-ready PWA for tracking your study sessions and rest time — with a streak system to keep you consistent.

---

## What is Study Timer?

Study Timer helps you stay focused by separating your productive time from your breaks. Every time you **start** the timer you're studying; every time you **pause** you're resting. When you stop a session both values are saved locally so you can review your habits over time.

No account needed — all data stays on your device via `localStorage`.

---

## Features

| Feature | Description |
|---|---|
| ⏱ **Start / Pause / Resume / Stop** | Full timer control. Pause = rest; running = study. |
| 📊 **Dashboard** | Bar chart (last 7 days) + pie chart (all-time ratio) of study vs rest. |
| 🔥 **Daily Streak** | Tracks consecutive days you completed a qualifying session (≥ 1 min study). Resets if you miss a day. |
| 💾 **Persistent Storage** | Sessions and streaks survive page refresh via `localStorage`. |
| ⬇ **Export JSON** | Download all your raw session data as a `.json` file from the Dashboard. |
| 📱 **PWA** | Installable on desktop or mobile — works offline after first load. |

---

## Screenshots

> Timer tab — green while studying, amber while resting.

> Dashboard tab — 7-day bar chart + all-time pie chart + summary cards.

---

## Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Kaigosama/Study-Timer.git
cd Study-Timer

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`) in any modern browser.

### Build for Production

```bash
npm run build
```

The optimised output is written to `dist/`. You can serve it with any static host:

```bash
npm run preview   # local preview of the production build
```

### Install as a PWA (Desktop / Mobile)

1. Open the app in Chrome or Edge.
2. Click the **install icon** in the address bar (or the browser menu → "Install Study Timer").
3. The app will open in its own window, just like a native app.

---

## How to Use

1. **Start** a session when you're ready to study.
2. **Pause** whenever you take a break — rest time is tracked automatically.
3. **Resume** when you're back.
4. **Stop** to save the session. Your study time, rest time, and streak are updated immediately.
5. Switch to the **Dashboard** tab to see your stats and charts.
6. Use **Export JSON** to download a backup of all your sessions.

### Streak Rules
- A session qualifies for a streak point if your study time is **≥ 1 minute**.
- The streak increments once per calendar day.
- Missing a day resets the streak to 1 on your next session.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18 | UI framework |
| [Vite](https://vitejs.dev/) | 5 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Utility-first styling |
| [Recharts](https://recharts.org/) | 2 | Bar & pie chart visualisations |
| [date-fns](https://date-fns.org/) | 3 | Date formatting & streak arithmetic |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | 0.20 | Service worker & PWA manifest |

---

## Project Structure

```
src/
├── components/
│   ├── Timer.jsx        # Timer UI (clock display + buttons)
│   ├── Dashboard.jsx    # Charts, summary cards, export button
│   └── Streak.jsx       # Flame badge + motivational message
├── hooks/
│   ├── useTimer.js      # Timer state machine (idle/running/paused)
│   └── useStore.js      # ALL localStorage access — isolated here
└── utils/
    ├── formatTime.js    # ms → HH:MM:SS
    └── dateHelpers.js   # todayStr(), computeStreak()
```

---

## License

MIT — do whatever you want with it.
