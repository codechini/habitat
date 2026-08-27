
1. Habitat — "Build streaks that last". One or two sentence description of the habit-tracking app.

2. Features (based on what exists + what the structure implies)
- Email/password authentication (sign up, sign in, sign out)
- Timezone selection captured at signup
- Protected routes — unauthenticated users are redirected to /login
- Dashboard with a header showing the signed-in user's email
- Zod schema validation for auth, habits, and daily check-ins (server + client)

3. Tech Stack
- Next.js 16 (App Router, RSC), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui, Base UI
- Supabase (Auth + SSR), Zod
- lucide-react icons

4. Project Setup — step by step:
  1. Clone repo (already local; still document for others)
  2. npm install
  3. Create a Supabase project (needed for auth)
  4. Create .env.local with the three required variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  5. npm run dev → open http://localhost:3000

5. Scripts — dev, build, start, lint (with brief descriptions).

6. Project Structure — short tree highlighting:
- src/app/(auth)/ — login & signup pages
- src/app/(protected)/ — authed dashboard, guarded layout
- src/lib/supabase/ — client, server, middleware/proxy
- src/lib/validation/ — Zod schemas (auth, habit, checkin)
- src/components/ — UI components (shadcn) + dashboard header, timezone picker