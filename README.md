# 🚨 JibonJatra BD (জীবনযাত্রা বিডি)
### 24/7 Emergency Healthcare, Hospital Facility Registry & Lifesaving Dispatch Platform

> **Emergency Notice:** JibonJatra BD is designed as a rapid coordination platform for Bangladesh. In life-threatening emergencies, always dial **999** (National Emergency Services) or **16263** (Shastho Batayan) immediately.

---

## 🌟 Overview

**JibonJatra BD (জীবনযাত্রা)** is a modern, responsive, mobile-first emergency healthcare web application designed specifically for Bangladesh. It enables citizens, first responders, and families to locate nearby hospitals with emergency casualty care, check ICU/NICU facilities, request matched voluntary blood donors, and dispatch ambulances with live estimated arrival times (ETA).

The facility registry is aligned with the **Government of the People's Republic of Bangladesh, Directorate General of Health Services (DGHS), Ministry of Health and Family Welfare (MOHFW)** [Facility Registry](https://hris.mohfw.gov.bd/public/facility-registry/).

---

## 🎨 Design System & Palette

- **Primary (Emergency Red):** `#D32F2F` — Pulsing emergency beacon, critical call buttons, code red status.
- **Secondary (Medical Blue):** `#1976D2` — Trusted healthcare actions, map overlays, navigation.
- **Success (Available Green):** `#2E7D32` — Available ICU/NICU beds, ready ambulances, active donors.
- **Warning (Alert Amber):** `#F57C00` — Limited bed availability, high demand.
- **Background (Clean Hospital Slate):** `#F7F9FC`
- **Typography:** Inter (Display/Headings) & Plus Jakarta Sans (Clean Body)
- **Icons:** Modern Lucide React icon set
- **Accessibility:** Multi-attribute status indicators (`🟢 Available`, `🟡 Limited`, `🔴 Full/Unavailable`, `⚪ Unknown`), high contrast, aria labels, and large touch targets.

---

## 🚀 Key Features

### 1. 🚨 Emergency Mode
- One tap: **Ambulance**, **Blood**, **Hospital**, **ICU/NICU**.
- Uses the phone's live GPS and shows the **nearest suitable resource to call** — nothing is dispatched automatically.
- Each request is logged (Supabase) so admins can follow up. For life-threatening emergencies the app always points to **999**.

### 2. 🏥 Hospital Finder
- **603 facilities** from the official DGHS facility registry (500) + curated hospitals, plus hospitals discovered live from OpenStreetMap around the user.
- Registry coordinates are area-level estimates → distances are shown as `~`. **Directions** open Google Maps from the phone's own GPS and search the hospital by name, so navigation lands on the real building.
- **No invented data:** ICU/NICU/bed availability is shown **only** after an admin confirms it with the hospital (with the confirmation time). Otherwise the card asks the user to call first.
- Phone numbers: only verified numbers are shown. Without one, the CALL button opens the hospital's Google Maps listing, which carries its current number.

### 3. 🩸 Blood Donors
- Only donors who **registered themselves** (with consent to be contacted) are listed.
- Donors log in, set blood group, area, last donation date and toggle "Available".

### 4. 🚑 Ambulances
- Public ambulance service listings (call to confirm availability) + driver-registered ambulances, which appear only after **admin verification**, with live Available/Busy/Offline status.

### 5. 🔐 Accounts & Roles (Supabase Auth)
- Real email + password login, password reset.
- Self-registration only as **Donor** or **Ambulance**. **Admin** can only be granted in the database.
- Security is enforced with Postgres Row Level Security (`supabase/schema.sql`).

### 6. 🛡️ Admin Panel
- Verify/unverify donors and ambulances.
- Update a hospital's ICU/NICU/Emergency/Blood bank/Oxygen status and verified emergency number.
- See and close emergency requests.

---

## 🗄️ Backend setup (Supabase — free tier)

1. Create a free project at <https://supabase.com>.
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Project Settings → API**: copy the *Project URL* and the *anon public* key.
4. Locally: copy `.env.example` to `.env.local` and fill both values.
   On Vercel/Netlify: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables and redeploy.
5. **Authentication → URL Configuration**: set *Site URL* to your live site URL (for the email confirmation / reset links).
6. Register on the website with your own email, then make yourself admin in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

Without these variables the site still works (hospital & ambulance finder, map, directions); login and the donor list show a "setup pending" notice.

---

## 💻 Tech Stack

- React 19 + TypeScript, Vite, Tailwind CSS, Lucide icons
- Leaflet + MapLibre (OpenFreeMap tiles), loaded lazily
- Supabase (Auth + Postgres + RLS) via plain `fetch` — no extra SDK
- Static data: `public/data/hospitals.json`, `public/data/ambulances.json` (source CSV in `scripts/data/`)

---

## 🛠️ Getting Started Locally

```bash
npm install
cp .env.example .env.local   # optional: add Supabase keys
npm run dev                  # http://localhost:5173
npm run build
```

> 📱 To test GPS on an Android phone, open the site over **HTTPS** (Chrome blocks location on plain `http://` LAN addresses). `npm run dev` already serves HTTPS via the basic-ssl plugin.
