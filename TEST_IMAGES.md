# Test if Images Are Accessible

## Quick Test

Open your browser and try to access the images directly:

1. **Logo**: http://localhost:5174/wizjock-logo.svg
2. **Slip 1**: http://localhost:5174/slips/slip1.svg

If these URLs show the images, then the files are there but the page needs to be refreshed.

If you get a 404 error, the dev server needs to be restarted.

## Fix: Restart the Dev Server

The Vite dev server sometimes doesn't pick up new files in the public folder until it's restarted.

### Stop the current server:
Press `Ctrl+C` in the terminal where `npm run dev:client` is running

### Start it again:
```bash
npm run dev:client
```

### Then refresh your browser:
Go to http://localhost:5174 and press Cmd+R (or Ctrl+R)

## Alternative: Hard Refresh

Sometimes the browser caches the 404 response. Try a hard refresh:
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + R

This will force the browser to reload everything from scratch.

## Still Not Working?

If images still don't show after restarting:

1. Check the browser console (F12 or Cmd+Option+I)
2. Look for any 404 errors
3. Verify the files exist:
   ```bash
   ls -la packages/client-portal/public/wizjock-logo.svg
   ls -la packages/client-portal/public/slips/
   ```
