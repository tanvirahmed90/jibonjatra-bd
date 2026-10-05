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
- **Typography:** Outfit (Display/Headings) & Plus Jakarta Sans (Clean Body)
- **Icons:** Modern Lucide React icon set
- **Accessibility:** Multi-attribute status indicators (`🟢 Available`, `🟡 Limited`, `🔴 Full/Unavailable`, `⚪ Unknown`), high contrast, aria labels, and large touch targets.

---

## 🚀 Key Features

### 1. 🚨 Emergency Mode ("GET EMERGENCY HELP")
- Triggered by a prominent pulsing red button on the hero and floating mobile bottom navigation.
- Automatically requests browser Geolocation (with fallback to central Dhaka or manual selection).
- 4 large 1-touch triage buttons:
  - 🚑 **I Need an Ambulance**
  - 🩸 **I Need Blood** (with 1-click blood group selector)
  - 🏥 **I Need a Hospital**
  - 🏨 **I Need ICU / NICU**
- Real-time emergency request progression tracker:
  `Emergency Request Created` ➔ `Searching nearby sector...` ➔ `Resource Assigned` ➔ `Live ETA & Direct Phone Call`.

### 2. 🏥 Hospital Finder & Facility Registry
- Synced with Bangladesh MOHFW Registry data (DMCH, Square, BSMMU, Suhrawardy, Evercare, Kurmitola, NICVD, CMCH Chittagong, Sylhet MAG Osmani, etc.).
- Real-time filter panel:
  - Distance radius slider (2km – 50+ km)
  - 24/7 Emergency casualty unit available
  - ICU bed availability
  - NICU unit available
  - Blood bank on-site
  - Central oxygen plant pressure
  - Administrative division (Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, etc.)
  - Facility classification (Govt Medical College, Specialized Institute, Private Tertiary, District Hospital, Upazila Health Complex).
- **Hospital Details Modal**:
  - Breakdown of **10 critical facilities**: Emergency, ICU, NICU, CCU, HDU, OT, Blood Bank, Oxygen Plant, Ventilator, 24/7 Pharmacy.
  - Reported Bed Inventory (Available vs Total).
  - One-tap 📞 **Call Hospital** and 🗺️ **Get Google Maps Directions**.

### 3. 🩸 Voluntary Blood Donor Network
- Search donors across all 8 blood groups: **A+, A-, B+, B-, AB+, AB-, O+, O-**.
- Area filtering across Dhaka (Dhanmondi, Mirpur, Uttara, Shahbagh, Panthapath, etc.) and divisions.
- **Privacy First:** Phone numbers are protected/masked until emergency contact is initiated.
- **Donor Registration Flow:** Allows citizens to sign up with blood group, last donation date, and emergency call consent.

### 4. 🚑 24/7 Ambulance Dispatcher
- Real-time cards showing provider name, vehicle type (ICU Ventilator, AC, Non-AC, Freezing Carrier), distance, and dynamic ETA (e.g. `ETA: 4 minutes`).
- **"Share My Location"**: 1-click button that formats exact GPS coordinates and landmark address for SMS/WhatsApp sharing with drivers.
- Direct "📞 CALL NOW" actions.

### 5. 🗺️ Interactive Leaflet Map
- Live markers for:
  - 📍 User detected location (blue pulsing beacon)
  - ✚ Hospitals (emergency red markers with facility summary popups)
  - 🚑 Ambulances (green/amber vehicle icons with live ETA)
  - 🩸 Blood donors (red blood droplet pins)
- Layer controls to toggle individual layers.
- One-click recentering.

### 6. ⚙️ Multi-Role Portals & Dashboards
JibonJatra BD features a 1-click **Quick Role Switcher** in the top navigation:
- **Citizen / Patient:** Standard emergency assistance and search.
- **Blood Donor:** Profile management and emergency readiness toggle.
- **Hospital Staff Dashboard:** Update live emergency triage status, open ICU/NICU beds, ventilator counts, and contact hotlines with automatic "Last updated" timestamps.
- **Ambulance Driver Dashboard:** Toggle status (`🟢 Available`, `🟡 Busy on Trip`, `🔴 Offline`), update GPS staging point, and ETA.
- **DGHS Admin Command Dashboard:** Regional bed capacity charts, active emergency logs, and verification approval workflows for new donors and hospitals.

### 7. 📱 Mobile-First Experience
- Sticky bottom navigation bar with an elevated center emergency trigger.
- Large touch targets (minimum 48px) designed for high-stress one-hand emergency usage.

---

## 🛡️ Safety & Compliance Notice

- JibonJatra BD follows ethical healthcare design standards.
- Unverified real-time data is explicitly labeled as **"Unknown"** or **"Unverified"**.
- Timestamps display exact synchronization time (e.g., *"12 mins ago (MOHFW Synced)"*).
- Prominent disclaimers remind users to call emergency hotlines to confirm bed reservations before transporting critical patients.

---

## 💻 Tech Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom healthcare palette and animations
- **Icons:** Lucide React
- **Mapping:** Leaflet.js with custom DivIcon markers
- **State & Storage:** Context API with `localStorage` persistence
- **Bundler:** Vite

---

## 🛠️ Getting Started Locally

```bash
# Clone or navigate to the project directory
cd "Emergency Healthcare project"

# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.
