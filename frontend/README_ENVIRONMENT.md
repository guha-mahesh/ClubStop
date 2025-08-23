# Environment Configuration

## How Backend URL Works

The application automatically detects the environment and uses the appropriate backend URL:

### Local Development (Default)
- **Uses:** `https://clubstop.onrender.com` (remote backend)
- **No configuration needed** - works out of the box
- **Same backend** as production - ensures consistency

### Local Development with Docker
- **Uses:** `http://localhost:3001` (local Docker backend)
- **Only when:** Running on `localhost` in development mode
- **For:** Testing local backend changes

### Production (Render)
- **Uses:** `https://clubstop.onrender.com` (same as local)
- **No configuration needed** - works out of the box

## Environment Variables

### For Custom Backend:
Set this in your environment:

```
VITE_BACKEND_URL=https://your-custom-backend.onrender.com
```

### For Local Development:
No environment variables needed - automatically uses remote backend

## How It Works

1. **Default:** Uses `https://clubstop.onrender.com` (works everywhere)
2. **Local Docker:** Uses `http://localhost:3001` (only when running locally)
3. **Custom:** Uses `VITE_BACKEND_URL` if set

## Why This Setup?

- **Consistency:** Same backend for local and production
- **Simplicity:** No environment variables needed
- **Flexibility:** Can still use local backend for development
- **Reliability:** Remote backend is always available

This ensures the app works both locally and on Render without any configuration! 