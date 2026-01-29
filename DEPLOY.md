# Deploying Fixes to Vercel (Keeping your Sync Links)

**Don't worry!** You can update the code at your existing links without changing the URLs.
Follow these steps to update your specific Frontend (`fortex-frontend.vercel.app`) and Backend (`fortex-hackathon.vercel.app`) with the fixes we made.

## Step 1: Push Changes to GitHub
1.  Open your terminal.
2.  Commit and push your latest code:
    ```bash
    git add .
    git commit -m "Fix CORS and API configuration"
    git push origin main
    ```
    *(Vercel usually auto-deploys when you push. If checking the Vercel dashboard shows a new building deployment, you can skip the "manual deployment" steps below, but **must** still check the settings).*

## Step 2: Configure Backend (`fortex-hackathon`)
1.  Go to your Vercel Dashboard and select the **`fortex-hackathon`** project.
2.  Go to **Settings** -> **Environment Variables**.
3.  Add (or Edit) this variable:
    -   **Key**: `FRONTEND_URL`
    -   **Value**: `https://fortex-frontend.vercel.app`
4.  **Redeploy** (if it didn't auto-deploy):
    -   Go to **Deployments** tab.
    -   Click the **three dots** (...) next to the latest deployment -> **Redeploy**.
    -   *Result: Your backend fixes are lived at `https://fortex-hackathon.vercel.app/`.*

## Step 3: Configure Frontend (`fortex-frontend`)
1.  Go to your Vercel Dashboard and select the **`fortex-frontend`** project.
2.  Go to **Settings** -> **Environment Variables**.
3.  Add (or Edit) this variable:
    -   **Key**: `VITE_API_URL`
    -   **Value**: `https://fortex-hackathon.vercel.app`
    -   *(Make sure there is NO trailing slash `/` at the end)*
4.  **Redeploy** (if it didn't auto-deploy):
    -   Go to **Deployments** tab.
    -   Click the **three dots** (...) next to the latest deployment -> **Redeploy**.
    -   *Result: Your frontend is updated at `https://fortex-frontend.vercel.app/`.*

## Step 4: Verify
1.  Open `https://fortex-frontend.vercel.app/`.
2.  Open the browser console (F12) to ensure no red errors appear.
3.  Try to Login/Submit a complaint.
