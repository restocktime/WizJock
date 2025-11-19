# How to Save Your WizJock Logo

## The logo you shared in chat needs to be saved manually.

### Steps:

1. **Right-click on the logo image** you shared in the chat (the blue and green wizard character with sports equipment)

2. **Save the image** to your computer as `wizjock-logo.png`

3. **Copy it to the project:**
   ```bash
   cp ~/Downloads/wizjock-logo.png packages/client-portal/public/wizjock-logo.png
   ```

   Or manually copy the file to:
   ```
   packages/client-portal/public/wizjock-logo.png
   ```

4. **Refresh your browser** - The logo will appear automatically!

## Where the Logo Will Show:

- ✅ **Hero Section** - Large logo (256x256px) at the top of the page
- ✅ **Footer** - Small logo (48x48px) next to the brand name

## Alternative: Use the Terminal

If you know where the logo file is saved, run:

```bash
# If it's in Downloads
cp ~/Downloads/[actual-filename].png packages/client-portal/public/wizjock-logo.png

# Or if it's on Desktop
cp ~/Desktop/[actual-filename].png packages/client-portal/public/wizjock-logo.png
```

The page is already set up to display the logo - it just needs the file to exist!
