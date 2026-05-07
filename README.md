# Football Registration / הרשמה למשחק כדורגל

Mobile-first registration tool for pickup football games.
React + Firestore. Bilingual (Hebrew RTL / English).

## Features

- Create a game with date, time, and max players
- Register by name (no login)
- Edit or remove any registration
- Live count of registered players vs. max
- Single active game at a time (creating a new one replaces the previous)
- Hebrew (RTL) + English with toggle

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a Firebase project at <https://console.firebase.google.com>, enable Firestore (in "test mode" is fine for the MVP), and copy the web app config.

3. Copy `.env.example` to `.env` and fill the values from the Firebase web app config:
   ```
   cp .env.example .env
   ```

4. Deploy the included `firestore.rules` to Firebase (or paste them in the Firestore Rules tab in the console).

5. Run locally:
   ```
   npm start
   ```

## Data model

```
games/active                       (single doc)
  date: "YYYY-MM-DD"
  time: "HH:mm"
  maxPlayers: number
  createdAt: Timestamp

games/active/players/{autoId}      (subcollection)
  name: string
  createdAt: Timestamp
  updatedAt?: Timestamp
```

## Notes

The MVP intentionally has no authentication: identity is the player's name and anyone with the link can register, edit, or replace the game. Suitable for a trusted group (a WhatsApp group, a friend list). Before opening this beyond that, add Firebase Auth and tighten `firestore.rules`.
