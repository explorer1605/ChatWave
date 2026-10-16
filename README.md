# 🌊 ChatWave

**Stop scrubbing through two-hour timelines. Drop a YouTube link and just ask the video.**

**ChatWave** is a lightweight, distraction-free YouTube chatbot built for people who want answers from videos without watching them at 2x speed. Paste any YouTube URL, let ChatWave index the video context, and have a direct, grounded conversation with the content—whether it's a dense engineering lecture, a product keynote, or a breaking news clip.

## ✦ Why ChatWave?

- **Zero-Clutter Workflow** — One input bar to start, one clean chat window to explore. No bloated sidebars or noisy dashboards.
- **Strictly Context-Grounded** — Answers are anchored directly to what is actually said in the video. If a topic isn't explicitly covered, ChatWave tells you upfront instead of hallucinating.
- **Section-Aware Synthesis** — Ask for a high-level overview or a section-by-section breakdown and get structured, readable notes in seconds.
- **Instant Session Switching** — Reset the current thread with a single click or jump straight to another video whenever you're done.

## ⚡ How It Flows

| Stage | What Happens | Under the Hood |
| :--- | :--- | :--- |
| **01 · Ingest** | Paste any YouTube video URL on the home screen | Parses the video ID and fetches the transcript context |
| **02 · Index** | Click **Process** to prepare the workspace | Chunks and indexes the video context for retrieval |
| **03 · Converse** | Ask targeted questions or request summaries | Retrieves relevant segments and generates grounded replies |
| **04 · Pivot** | Refresh the thread or click **← Process another video** | Clears session state for a fresh video lookup |

## 📸 In the Wild
![alt text](<screenshots/youtube chatbot(1).png>) ![alt text](<screenshots/youtube chatbot(3).png>) ![alt text](<screenshots/youtube chatbot(4).png>) ![alt text](<screenshots/youtube chatbot(5).png>)

## 🛠️ Quickstart

### 1. Clone the repository

```bash
git clone https://github.com/explorer1605/ChatWave.git
cd ChatWave
```

### 2. Configure environment variables

Create a `.env` file in the project root and add your LLM / API credentials:

```env
# Example environment configuration
API_KEY=your_api_key_here
PORT=8000
```

### 3. Install dependencies & run

```bash
# Backend setup (Python / FastAPI / Flask)
pip install -r requirements.txt
python app.py

# Frontend setup (if running a separate client)
npm install
npm run dev
```

## 🗂️ Project Layout

```text
ChatWave/
├── assets/                  # UI screenshots & static media
├── src/                     # Core application & chat interface
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

## 🤝 Contributing

Found a bug or want to add timestamp citations or multi-video playlists?

1. Fork the repository (`https://github.com/explorer1605/ChatWave`)
2. Create a feature branch (`git checkout -b feat/timestamp-links`)
3. Commit your changes (`git commit -m "feat: add clickable timestamps"`)
4. Open a Pull Request

## 📄 License

Released under the **MIT License**. Built by **explorer1605**.