# Docs Analyzer

A full-stack web application for uploading PDF files and extracting their text content, with upload history stored in PostgreSQL.

Note: The use case of images turned pdf files has not been considered for this project. Currently this demo project allows extraction of pdf with only text. Further extensions can be configured for scalability.

## Features

- Drag-and-drop or click-to-upload PDF files (max 20 MB)
- Instant text extraction from PDFs
- Upload history (last 5 files) with extracted text viewable inline
- REST API with interactive Swagger documentation

## Tech Stack

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | React 18, Vite           |
| Backend  | Node.js, Express         |
| Database | PostgreSQL               |
| API Docs | Swagger UI (OpenAPI 3.0) |

## Project Structure

```
docs-analyzer/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── DropZone.jsx
│       │   ├── ExtractedResult.jsx
│       │   ├── HistoryItem.jsx
│       │   └── HistoryList.jsx
│       ├── hooks/
│       │   ├── useExtract.js
│       │   └── useHistory.js
│       ├── utils/
│       │   └── formatDate.js
│       ├── App.jsx
│       └── App.css
└── server/                  # Express backend
    └── src/
        ├── routes/
        │   └── pdf.js
        ├── db.js
        ├── index.js
        └── swagger.js
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A running PostgreSQL instance

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd docs-analyzer
```

### 2. Configure the server

Create `server/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:password@82.112.227.182:5432/docs_analyzer
```

The database table is created automatically on first run — no migrations needed.

### 3. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Run the development servers

Open two terminals:

```bash
# Terminal 1 — API server
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

| Service    | URL                            |
| ---------- | ------------------------------ |
| Frontend   | http://localhost:5173          |
| API server | http://localhost:3001          |
| Swagger UI | http://localhost:3001/api-docs |

## API Reference

Interactive docs available at **http://localhost:3001/api-docs**

### `POST /api/extract`

Upload a PDF and extract its text.

**Request** — `multipart/form-data`

| Field  | Type   | Description         |
| ------ | ------ | ------------------- |
| `file` | binary | PDF file, max 20 MB |

**Response `200`**

```json
{
  "filename": "report.pdf",
  "text": "Extracted text content..."
}
```

**Error responses**

| Status | Reason                                |
| ------ | ------------------------------------- |
| `400`  | No file provided or file is not a PDF |
| `400`  | File exceeds 20 MB limit              |
| `500`  | Text extraction failed                |

---

### `GET /api/history`

Returns the 5 most recently uploaded files.

**Response `200`**

```json
[
  {
    "id": 1,
    "filename": "report.pdf",
    "extracted_text": "Lorem ipsum...",
    "uploaded_at": "2024-06-01T12:00:00.000Z"
  }
]
```

## Environment Variables

| Variable       | Required | Description                       |
| -------------- | -------- | --------------------------------- |
| `DATABASE_URL` | Yes      | PostgreSQL connection string      |
| `PORT`         | No       | API server port (default: `3001`) |

## Building for Production

```bash
# Build the frontend
cd client && npm run build
# Output is in client/dist/ — serve with any static host or Express

# Start the API server
cd server && npm start
```

---

## High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
│                    http://localhost:5173                        │
└─────────────────────┬───────────────────────────────┬───────────┘
                      │                               │
              [Upload PDF]                    [View History]
              (drag/drop)                    (on page load)
                      │                               │
                      ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                        │
│                                                                 │
│  DropZone.jsx        useExtract.js        useHistory.js         │
│  (file input)  ───► (POST /api/extract)   (GET /api/history)    │
│                                                │                │
│  ExtractedResult.jsx ◄─────────────────────────┘                │
│  HistoryList.jsx / HistoryItem.jsx                              │
└─────────────────────────────┬───────────────────────────────────┘
                              │  HTTP (REST)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 EXPRESS BACKEND (Node.js :3001)                 │
│                                                                 │
│  index.js                                                       │
│  └── /api  ──► routes/pdf.js                                    │
│       │                                                         │
│       ├── POST /extract                                         │
│       │    1. Multer middleware (validates .pdf, max 20 MB)     │
│       │    2. pdf-parse → extract raw text                      │
│       │    3. INSERT into PostgreSQL                            │
│       │    4. Return { filename, text }                         │
│       │                                                         │
│       └── GET /history                                          │
│            1. SELECT last 5 rows from DB                        │
│            2. Return array of records                           │
│                                                                 │
│  swagger.js ──► GET /api-docs  (Swagger UI)                     │
└─────────────────────────────┬───────────────────────────────────┘
                              │  pg (node-postgres)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                          │
│                                                                 │
│   Table: uploads                                                │
│   ┌────┬──────────┬────────────────┬─────────────────────┐     │
│   │ id │ filename │ extracted_text │ uploaded_at          │     │
│   └────┴──────────┴────────────────┴─────────────────────┘     │
│   (auto-created on first server start)                          │
└─────────────────────────────────────────────────────────────────┘
```

**Request Lifecycle — Upload:**

```
Browser → DropZone → useExtract (fetch POST) → Multer → pdf-parse
       → DB INSERT → JSON response → ExtractedResult renders text
```

**Request Lifecycle — History:**

```
Browser → useHistory (fetch GET) → DB SELECT (LIMIT 5)
       → JSON array → HistoryList renders items
```
