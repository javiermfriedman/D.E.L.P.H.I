![Image](https://github.com/user-attachments/assets/9e3ddf8c-f27d-485d-a7af-9fb7d236abba)
D.E.L.P.H.I. is a full-stack word-of-the-day application inspired by the ancient Oracle of Delphi. Users can manually curate their own vocabulary queue or invoke the Oracle — an LLM-powered agent that generates seven thoughtfully selected words at a time. A scheduled GitHub Actions workflow then delivers the next word each morning directly to WhatsApp.

<p align="center">
  <a href="https://www.youtube.com/watch?v=UiADcmmo-nc">
    <img src="https://img.shields.io/badge/▶%20Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube&logoColor=white" />
  </a>
</p>
## Features

- **Word management** — Add words with definitions and parts of speech, powered by live dictionary lookup as you type.
- **Upcoming queue** — A reorderable timeline of words waiting to be featured, rendered as a vertical roadmap.
- **Past words** — A masonry grid of previously featured words displayed on glass-style cards.
- **The Oracle** — Invoke a LangGraph ReAct agent backed by OpenAI to generate seven vocabulary words, complete with definitions, that are automatically enqueued.
- **Daily delivery** — A scheduled GitHub Actions workflow hits the `/send` endpoint each morning, moving the next word from upcoming to past and sending it via Twilio WhatsApp.
- **Animated UI** — Floating word particles, typewriter title reveal, crystal ball summoning sequence with elder futhark runes, and smooth page transitions.

---

## Tech Stack

| Layer         | Technologies                                        |
| ------------- | --------------------------------------------------- |
| Frontend      | React 19, React Router 7, Vite 8                    |
| Backend       | Python 3.12, FastAPI, Uvicorn                       |
| Database      | Supabase (PostgreSQL)                                |
| Integrations  | Twilio (WhatsApp), Free Dictionary API              |
| AI / LLM      | LangChain, LangChain-OpenAI, LangGraph              |
| CI            | GitHub Actions (daily cron job)                      |

---

## Project Structure

```
delphi/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, routes, CORS
│   │   ├── server.py            # Business logic (send, divine, etc.)
│   │   ├── schemas.py           # Pydantic request/response models
│   │   └── services/
│   │       ├── dictionary.py    # Free Dictionary API client
│   │       ├── llm.py           # LangGraph Oracle agent
│   │       ├── supabase_client.py  # Supabase CRUD helpers
│   │       └── twilio.py        # WhatsApp message sender
│   ├── tests/
│   ├── requirements.txt
│   └── boot_up.py               # macOS dev launcher (optional)
├── frontend/
│   └── src/
│       ├── api/client.js        # Fetch calls to FastAPI
│       ├── hooks/               # Data-fetching hooks
│       ├── pages/               # Landing, Dashboard
│       └── components/
│           ├── landing/         # WordParticles, TypewriterTitle
│           ├── sidebar/         # Navigation
│           ├── upcoming/        # Timeline queue view
│           ├── past/            # Masonry grid of featured words
│           ├── oracle/          # Summoning animation, StoneTablet
│           └── modals/          # AddWord, Banish, Choice modals
└── .github/workflows/
    └── send-daily-word.yml      # Daily cron → POST /send
```

---

## API Endpoints

| Method   | Path                | Description                                          |
| -------- | ------------------- | ---------------------------------------------------- |
| `GET`    | `/`                 | Health check                                         |
| `POST`   | `/words`            | Add a new word and enqueue it                        |
| `GET`    | `/words/upcoming`   | List all upcoming words                              |
| `GET`    | `/words/past`       | List all past featured words                         |
| `DELETE` | `/words/{word_id}`  | Remove a word from the upcoming queue                |
| `POST`   | `/dictionary/lookup`| Look up a word definition from the dictionary API    |
| `POST`   | `/words/divine/`    | Invoke the Oracle to generate and enqueue 7 words    |
| `POST`   | `/send`             | Feature the next word, send via WhatsApp, move to past|

---

## Database Schema

Three tables in Supabase (PostgreSQL):

- **`words`** — `id`, `word`, `definition`, `part_of_speech`, `created_at`
- **`upcoming`** — `id`, `word_id` (FK → words), `added_at` — ordered queue, oldest first
- **`past`** — `id`, `word_id` (FK → words), `featured_on` — archive of delivered words

---

## Getting Started

### Prerequisites

- A [Supabase](https://supabase.com) project with the tables above
- A [Twilio](https://www.twilio.com) account with WhatsApp sandbox or approved sender
- An [OpenAI](https://platform.openai.com) API key (for the Oracle feature)

### Environment Variables

Create `backend/.env` with:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TO_NUMBER=whatsapp:+1234567890
FROM_NUMBER=whatsapp:+0987654321
OPENAI_API_KEY=your-openai-api-key
```

### Docker (recommended)

The easiest way to run the full stack. Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up --build
```

| Service  | URL                    |
| -------- | ---------------------- |
| Frontend | `http://localhost:3000` |
| Backend  | `http://localhost:8000` |

The frontend's nginx server automatically proxies API requests to the backend, so everything works through port 3000.

To stop the containers:

```bash
docker compose down
```

### Local Development

If you prefer running without Docker, you'll also need Python 3.12+ and Node.js 22+.

**Backend:**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Tests

```bash
cd backend
pytest
```

---

## Daily Word Delivery

The GitHub Actions workflow (`.github/workflows/send-daily-word.yml`) runs daily at 13:00 UTC (8 AM EST). It spins up the backend, calls `POST /send`, and the endpoint:

1. Pulls the next word from the **upcoming** queue (oldest first)
2. Moves it to the **past** table
3. Sends the word and definition via Twilio WhatsApp

If the upcoming queue is empty, the Oracle is automatically invoked to refill it before sending.

To trigger it manually, use the **Run workflow** button in the GitHub Actions tab.

---

## License

This project is licensed under the [MIT License](LICENSE).
