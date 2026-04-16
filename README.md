# JoinForJoin (J4J)

JoinForJoin is a Discord bot + web panel project focused on letting users sign in with Discord OAuth2, define an invite code, enter a matchmaking queue, and automatically progress a mutual server-join workflow.

This repository brings together Discord bot logic, an Express-based panel, real-time status flow with Socket.IO, and user data stored in MongoDB.

## Features

- Sign in with a Discord account (`passport-discord`)
- Save a user's server invite code
- Join a matchmaking queue and automatically match users
- Instant status updates with Socket.IO
- Simple user/data storage structure on MongoDB
- Trigger server join operations through the Discord bot

## How It Works

1. The user signs in with Discord.
2. The user enters their own server invite code in the panel.
3. When matchmaking starts, the user is added to the queue.
4. `events/finding.js` finds a suitable second user in the background.
5. The bot validates both invite codes and attempts join operations.
6. The result is reflected to the panel in real time through Socket.IO.

## Tech Stack

- Node.js 16.x
- Express
- Socket.IO
- Discord.js v13
- Passport Discord
- EJS
- MongoDB / Mongoose

## Project Structure

- `main.js`: Starts the bot, Express app, and Socket.IO server.
- `events/ready.js`: Event that runs when the bot is ready.
- `events/finding.js`: Main flow that matches users in the queue.
- `functions/global.js`: Helper functions, data access, and Discord join operations.
- `views/`: Panel-side routes, templates, and client code.
- `databases/`: MongoDB connection and model definitions.
- `config.js`: Core configuration for the panel and Discord application.

## Setup

### Requirements

- Node.js `16.x`
- npm
- A MongoDB connection
- An application/bot created through the Discord Developer Portal

### Steps

1. Install dependencies:

```bash
npm install
```

Note: The source code uses `mongoose`. If this package is missing in a clean install, run `npm install mongoose` as well.

2. Update the required configuration:

- Update the `panel`, `owners`, and `bot` fields in `config.js` with your own values.
- Change the MongoDB connection URL in `databases/database.js` to match your database.

3. Define environment variables:

```bash
export PORT=3000
export token=YOUR_DISCORD_BOT_TOKEN
```

4. Run the application:

```bash
npm start
```

## Configuration Notes

In this version, some settings are read directly from files:

- `config.js > panel`: Public URL where the panel will run
- `config.js > bot.id`: Discord application/bot ID
- `config.js > bot.secret`: Discord OAuth2 client secret
- `process.env.token`: Discord bot token
- `process.env.PORT`: Port the web server listens on
- `databases/database.js`: MongoDB connection string
