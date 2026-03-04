# Google OAuth Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Enter project name: `Eker AI Control Center`
4. Click **Create**
5. Wait for the project to be created

## Step 2: Enable Google+ API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for `Google+ API`
3. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, click **Configure OAuth consent screen** first:
   - User Type: **External**
   - Click **Create**
   - Fill in:
     - App name: `Eker AI Control Center`
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue**
   - Add scopes: Select `email` and `profile`
   - Click **Save and Continue**
   - Add test users (optional)
   - Click **Save and Continue**
4. Back to Credentials, click **+ Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: `Eker AI Backend`
7. Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   https://your-production-domain.com/api/auth/google/callback
   ```
8. Click **Create**
9. Copy **Client ID** and **Client Secret**

## Step 4: Add Credentials to Backend .env

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
ADMIN_EMAILS=your-email@gmail.com
```

Replace:
- `your_client_id_here` → Paste the Client ID
- `your_client_secret_here` → Paste the Client Secret
- `your-email@gmail.com` → Your Google account email (to grant admin role)

## Step 5: Restart Backend

```bash
cd backend
npm start
```

## Step 6: Test Google Login

1. Open `http://localhost:3001`
2. Click **Sign in with Google**
3. Choose your Google account
4. You should be logged in as admin

## Troubleshooting

### Error: "Redirect URI mismatch"
- Make sure the callback URL in Google Console matches exactly:
  - Local: `http://localhost:5000/api/auth/google/callback`
  - Production: `https://yourdomain.com/api/auth/google/callback`

### Error: "OAuth not configured"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `backend/.env`
- Restart backend after adding/changing env vars

### Not getting admin role
- Add your email to `ADMIN_EMAILS` in `backend/.env` (use comma-separated list for multiple admins)
- Email must match exactly (case-insensitive)

## Production Setup

For production (e.g., on Netlify):

1. Update redirect URI in Google Console:
   ```
   https://your-app.netlify.app/auth/success
   ```
   (Note: This should match your actual deployment URL)

2. Set env vars in backend environment (e.g., Heroku, Railway, or Docker):
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
   FRONTEND_URL=https://your-app.netlify.app
   ```
