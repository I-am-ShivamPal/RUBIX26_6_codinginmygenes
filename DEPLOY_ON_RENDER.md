# Deploying Smart-ProctorAI on Render (Docker Method)

Since you want to use Docker directly without a `render.yaml`, you will manually create two "Web Services" on Render—one for the Backend and one for the Frontend.

## Prerequisites
1.  **Push the latest code**: Your repo must be up-to-date on GitHub.
    ```bash
    git add .
    git commit -m "Prepare Dockerfiles for Render"
    git push origin main
    ```
2.  **MongoDB Atlas**: Render does not host databases for free. You need a MondoDB connection string (e.g., from [MongoDB Atlas](https://www.mongodb.com/atlas/database)).
    *   Format: `mongodb+srv://<user>:<password>@cluster0.p839c.mongodb.net/rubix_db?retryWrites=true&w=majority`

---

## Step 1: Deploy Backend (Python/FastAPI)

1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Select **Build and deploy from a Git repository**.
4.  Connect your repository (`RUBIX26_6_codinginmygenes`).
5.  **Configuration**:
    *   **Name**: `smart-proctor-backend` (or similar)
    *   **Region**: Singapore (or closest to you)
    *   **Branch**: `main`
    *   **Root Directory**: `backend` (Important! This tells Render where the Dockerfile is)
    *   **Runtime**: **Docker** (Select this explicitly)
    *   **Instance Type**: Free
6.  **Environment Variables** (Click "Advanced"):
    *   `MONGODB_URI`: `your_mongodb_atlas_connection_string`
    *   `SECRET_KEY`: `your_secret_key` (generate a random string)
    *   `CORS_ORIGINS`: `*` (Allow all initially, or put your frontend URL once generated)
7.  Click **Create Web Service**.
8.  **Wait**: Render will build the Docker image. Once done, it will give you a URL (e.g., `https://smart-proctor-backend.onrender.com`). **Copy this URL.**

---

## Step 2: Deploy Frontend (Next.js)

1.  Click **New +** -> **Web Service**.
2.  Connect the same repository again.
3.  **Configuration**:
    *   **Name**: `smart-proctor-frontend`
    *   **Region**: Same as backend
    *   **Branch**: `main`
    *   **Root Directory**: `frontend` (Important!)
    *   **Runtime**: **Docker**
    *   **Instance Type**: Free
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste the **Backend URL** from Step 1 (e.g., `https://smart-proctor-backend.onrender.com`).
        *   *Note: Ensure there is NO trailing slash `/` at the end.*
5.  Click **Create Web Service**.
6.  **Important**: Because Next.js "bakes in" environment variables at build time, you MUST set the `NEXT_PUBLIC_API_URL` variable **before** the initial build starts. If the build starts before you set it, just go to "Environment" tab, set it, and click "Manual Deploy" -> "Clear build cache & deploy".

---

## Troubleshooting

*   **Build Failures**: Check the logs. If `npm ci` fails in frontend, ensure `package-lock.json` is in the repo.
*   **Connection Errors**:
    *   If Frontend says "Network Error", check if `NEXT_PUBLIC_API_URL` is correct (https://...).
    *   Check Backend logs to see if it connected to MongoDB successfully.
*   **Whitelisting**: In MongoDB Atlas, you must "Allow Access from Anywhere" (0.0.0.0/0) in Network Access, because Render IPs change dynamicallly.
