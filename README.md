# Let Me X That For You

A tiny, playful AI-era nudge: enter a question, copy the generated link, and the recipient sees it get typed and ceremoniously submitted.

## How it works

- The prompt is stored only in the URL fragment (`#ask=...`). Browsers do not send fragments to the server.
- There is no backend, database, account system, analytics, AI API, or stored prompt history.
- The recipient can copy the question after the animation if they want to use it with their preferred AI tool.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

## Deploy

The project is static and is ready to deploy to Vercel.
