# RUBIX26_6_codinginmygenes

# AI-Based Smart Examination Proctoring System

An MVP-grade, AI-powered automated proctoring system designed to monitor online examinations. This system leverages Computer Vision (MediaPipe) regarding Face Presence, Head Pose Estimation, and Browser Event Monitoring to detect malpractice in real-time.

## 🚀 Key Features

*   **Real-time Face Detection**:
    *   **Single Face Verification**: Ensures only the candidate is present.
    *   **Multiple Face Detection**: Flags a violation if more than one person is seen.
    *   **No Face Detection**: Alerts if the candidate leaves the frame.
    *   **Anti-Spoofing/Ghost Filtering**: Intelligent geometric filtering to prevent false positives from motion blur or poor lighting.
*   **Head Pose & Gaze Estimation**:
    *   Tracks head orientation (Left, Right, Center) to infer if the candidate is looking away.
*   **Browser & Tab Monitoring**:
    *   **Tab Switching**: Detects if the user switches tabs or minimizes the browser.
    *   **Window Focus**: Detects if the user clicks outside the exam window (e.g., to open another application).
*   **Risk Scoring Engine**:
    *   Calculates a cumulative "Risk Score" based on weighted violations.
    *   Categorizes sessions as **LOW**, **MEDIUM**, or **HIGH** risk.
*   **Audit Logging**:
    *   Persists all violations and session data to MongoDB for post-exam review.
*   **Visual Feedback**:
    *   Live webcam feed with real-time status overlays (Face Count, Connection Status, Gaze Direction).

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
*   **Backend**: Python FastAPI, Uvicorn
*   **AI/CV**: Google MediaPipe, OpenCV, NumPy
*   **Database**: MongoDB (via Motor/PyMongo)
*   **DevOps**: Docker, Docker Compose

## 📋 Prerequisites

*   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.
*   A webcam connected to your computer.

## 🏃‍♂️ How to Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/I-am-ShivamPal/RUBIX26_6_codinginmygenes.git
    cd ai-smart-proctoring
    ```

2.  **Start the Application**:
    Run the following command to build and start all services (Frontend, Backend, Database):
    ```bash
    docker compose up --build
    ```
    *Note: The first run may take a few minutes to download images and install dependencies.*

3.  **Access the Dashboard**:
    *   **Candidate Exam Portal**: [http://localhost:3000](http://localhost:3000)
    *   **Proctor API Docs**: [http://localhost:8001/docs](http://localhost:8001/docs)
    *   **MongoDB Interface**: [mongodb://localhost:27018](mongodb://localhost:27018)

## 🛑 How to Stop

To stop the application and remove containers:
```bash
docker compose down
```
To stop but keep data volumes (persisted logs):
`Ctrl + C` in the terminal.

## 📁 Project Structure

```bash
ai-smart-proctoring/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/             # API Routes
│   │   ├── core/            # Logic (Face Detection, Risk Engine)
│   │   ├── db/              # Database Connection
│   │   └── models/          # Pydantic Schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # Next.js Frontend
│   ├── app/                 # App Router Pages
│   ├── components/          # Reusable Components (WebcamFeed, RiskIndicator)
│   ├── hooks/               # Custom Hooks (useProctoring, useWebcam)
│   └── Dockerfile
├── docker-compose.yml       # Orchestration
└── README.md
```

## 🔧 Configuration

You can configure the system environment variables in `docker-compose.yml`:

*   `NEXT_PUBLIC_API_URL`: URL of the backend API (Default: `http://localhost:8001/api`)
*   `MONGODB_URL`: MongoDB connection string.
*   `FRAME_INTERVAL`: Polling interval for frame analysis (Default: 2000ms).

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
