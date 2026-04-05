# APSR Year 5 Computing App

A deployable Next.js web app for the Year 5 Scratch selection unit.

## What this includes
- Home page
- Pupil dashboard
- Teacher area
- Browser-based progress tracking using local storage
- Ready for easy deployment on Vercel

## Before you deploy
1. Create a `.env.local` file.
2. Copy the content from `.env.example`.
3. Change the teacher code if you want.

Example:
```env
NEXT_PUBLIC_TEACHER_CODE=YourOwnCodeHere
```

## Run locally
1. Install Node.js 20 or newer.
2. Open a terminal in this project folder.
3. Run:
```bash
npm install
npm run dev
```
4. Open `http://localhost:3000`

## Easiest deployment with no developer
### Option 1: Vercel
1. Create a GitHub account if you do not already have one.
2. Upload this project to a new GitHub repository.
3. Create a free Vercel account.
4. Import the GitHub repository into Vercel.
5. Add this environment variable in Vercel:
   - `NEXT_PUBLIC_TEACHER_CODE`
6. Click Deploy.

After deployment, Vercel will give you a live web address.

## Important note
This version stores pupil progress in each browser only. If you want central tracking for the whole school, the next upgrade is to connect a database such as Supabase or Firebase.
