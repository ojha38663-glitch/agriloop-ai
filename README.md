# AgriLoop AI — full-stack student prototype

A beginner-friendly local full-stack website for agricultural residue listings. It includes a responsive frontend, a Node.js/Express API, and a persistent SQLite database.

## Features
- Add agricultural residue listings
- Save listings in SQLite (they remain after refresh and server restart)
- Search by waste type, area, or notes
- Filter by residue type
- View listing count, total listed kg, and areas covered
- Delete a listing in this local demo
- Input validation on the backend
- Optional demo records clearly labelled as example data

## Requirements
- Node.js 18 or newer
- Internet for the first `npm install` (to download dependencies)

## Run it on Windows (VS Code)
1. Extract `AgriLoopAI.zip` to a folder, for example Desktop\AgriLoopAI.
2. Open that folder in VS Code.
3. In VS Code, select **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   ```

5. After it finishes, run:

   ```bash
   npm start
   ```

6. Keep the terminal running. Open this URL in your browser: **http://localhost:3000**
7. Add a test listing, refresh the page, and confirm it remains visible. You can also inspect `data/agriloop.db` (created automatically).
8. To stop the server, click the terminal and press `Ctrl+C`.

## Optional: start with an empty database
The first run seeds three clearly labelled demo listings. To disable demo rows, use PowerShell:

```powershell
$env:SEED_DEMO="false"
npm start
```

The database file is created at `data/agriloop.db`. If demo rows already exist, setting the environment variable later will not delete them.

## API endpoints
- `GET /api/health` — server health
- `GET /api/listings?search=...&type=...` — list/search/filter
- `GET /api/stats` — summary numbers
- `POST /api/listings` — add a listing
- `DELETE /api/listings/:id` — delete a listing in the local demo

## Important limitations
- This is a local student prototype, not a public marketplace. There is no login, ownership control, buyer verification, payment, or production deployment setup. Do not publish this server publicly as-is; in particular, deletion is intentionally open for local demo use.
- Demo listings are fictional. Do not present them as real farmer data or startup traction.
- No AI model is integrated yet; “AI” is currently the project brand/concept, not a claim of implemented AI functionality.
- The SQLite database lives on the computer where the Node server runs. It is not synced between different users' computers.

## Project structure

```text
AgriLoopAI/
  server.js
  package.json
  README.md
  public/
    index.html
  data/                 # auto-created on first run; database lives here
```
