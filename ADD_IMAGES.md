# How to Add Your Betting Slip Images

## Step 1: Save Your Betting Slip Images

You shared 6 betting slip images in the chat. Save them to your computer with these names:

1. `slip1.png` - The 5-Bet Parlay ($15 → $222.92)
2. `slip2.png` - The 6-Bet Parlay with profit boost ($15 → $300.41)
3. `slip3.png` - The UFC 4-Bet Parlay ($10 → $763.39) - BIG WINNER!
4. `slip4.png` - The 3-Bet Parlay ($20 → $74.12)
5. `slip5.png` - The 2-Bet Parlay ($50 → $108.89)
6. `slip6.png` - The 6-Bet Parlay ($20 → $197.69)

## Step 2: Copy Images to the Project

Copy all 6 images into this folder:
```
packages/client-portal/public/slips/
```

## Step 3: Add Your Logo (Optional)

If you want to add the WizJock logo to the hero section and footer:

1. Save your logo image as `wizjock-logo.png`
2. Copy it to: `packages/client-portal/public/`

Then uncomment the logo code in `packages/client-portal/src/App.tsx`

## Step 4: Run the Site

```bash
npm install
npm run docker:up
npm run dev:client
```

Visit: http://localhost:5174

## Quick Copy Command (if images are in Downloads)

```bash
# Copy slips (adjust the source filenames to match your actual files)
cp ~/Downloads/slip1.png packages/client-portal/public/slips/slip1.png
cp ~/Downloads/slip2.png packages/client-portal/public/slips/slip2.png
cp ~/Downloads/slip3.png packages/client-portal/public/slips/slip3.png
cp ~/Downloads/slip4.png packages/client-portal/public/slips/slip4.png
cp ~/Downloads/slip5.png packages/client-portal/public/slips/slip5.png
cp ~/Downloads/slip6.png packages/client-portal/public/slips/slip6.png

# Copy logo
cp ~/Downloads/wizjock-logo.png packages/client-portal/public/wizjock-logo.png
```
