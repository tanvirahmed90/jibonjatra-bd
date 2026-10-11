# 🏥 জীবনযাত্রা বিডি (JibonJatra BD) — প্রজেক্ট ডকুমেন্টেশন ও গাইডলাইন

> **প্রজেক্টের নাম:** JibonJatra BD (Emergency Healthcare & Dispatch Platform)  
> **উদ্দেশ্য:** বাংলাদেশের জরুরি স্বাস্থ্যসেবা (হাসপাতাল, আইসিইউ/এনআইসিইউ, অ্যাম্বুলেন্স, রক্তদাতা) দ্রুত খুঁজে পাওয়ার ও সমন্বয়ের একটি আধুনিক ওয়েব প্ল্যাটফর্ম।

---

## 📑 সূচিপত্র (Table of Contents)
1. [প্রজেক্ট ওভারভিউ (Project Overview)](#১-প্রজেক্ট-ওভারভিউ-project-overview)
2. [কী কী টেকনোলজি ও টুল ব্যবহার করা হয়েছে (Tech Stack Used)](#২-কী-কী-টেকনোলজি-ও-টুল-ব্যবহার-করা-হয়েছে-tech-stack-used)
3. [প্রজেক্টের আর্কিটেকচার ও ফাইল স্ট্রাকচার (File Structure)](#৩-প্রজেক্টের-আর্কিটেকচার-ও-ফাইল-স্ট্রাকচার-file-structure)
4. [অ্যাপ্লিকেশন কীভাবে কাজ করে (How the App Works)](#৪-অ্যাপ্লিকেশন-কীভাবে-কাজ-করে-how-the-app-works)
5. [কীভাবে এই প্রজেক্টে কাজ করবেন (How to Develop & Add Features)](#৫-কীভাবে-এই-প্রজেক্টে-কাজ-করবেন-how-to-develop--add-features)
6. [কমান্ডসমূহ ও গিট গাইড (Commands & Deployment)](#৬-কমান্ডসমূহ-ও-গিট-গাইড-commands--deployment)

---

## ১. প্রজেক্ট ওভারভিউ (Project Overview)

**JibonJatra BD** হলো একটি মোবাইল-ফার্স্ট জরুরি স্বাস্থ্যসেবা ওয়েব অ্যাপ্লিকেশন যা বাংলাদেশের প্রেক্ষাপটে তৈরি। এর মূল সুবিধাসমূহ:
- 🚨 **এক ক্লিকে জরুরি সাহায্য (One-touch Emergency Mode):** অ্যাম্বুলেন্স, রক্ত, হাসপাতাল বা আইসিইউ তাৎক্ষণিক কল ও রিকোয়েস্ট ট্র্যাকিং।
- 🏥 **হাসপাতাল ও আইসিইউ খোঁজ:** DGHS/MOHFW রেজিস্ট্রি সমর্থিত হাসপাতাল ডাটাবেস, যেখানে ১০টি জরুরি সুবিধা (ICU, NICU, CCU, অক্সিজেন, ব্লাড ব্যাংক ইত্যাদি) দেখা যায়।
- 🗺️ **ইন্টারেক্টিভ ম্যাপ (Interactive Map):** ব্যবহারকারীর লাইভ জিপিএস লোকেশন থেকে নিকটস্থ হাসপাতাল ও অ্যাম্বুলেন্সের দূরত্ব ও রুট দেখা।
- 🩸 **স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক (Blood Donor Network):** ব্লাড গ্রুপ ও এরিয়া অনুযায়ী রক্তদাতা খোঁজা ও নতুন ডোনার রেজিস্ট্রেশন।
- 🚑 **২৪/৭ অ্যাম্বুলেন্স ডিসপ্যাচার:** দূরত্বের ভিত্তিতে স্বয়ংক্রিয় ETA (আনুমানিক পৌঁছানোর সময়) ও জিপিএস লোকেশন সরাসরি ড্রাইভারকে পাঠানোর সুবিধা।
- 👥 **সুনির্দিষ্ট ৩টি রোল ড্যাশবোর্ড (3 Dedicated Portals):** 
  - **Blood Donor:** বয়স, রক্তের গ্রুপ, ফোন, এলাকা ও সর্বশেষ রক্তদানের তারিখ আপডেট করার নির্দিষ্ট প্রোফাইল।
  - **Ambulance Driver:** গাড়ির নম্বর, চালকের মোবাইল ও বর্তমান স্ট্যান্ডবাই লোকেশন আপডেট করার ড্যাশবোর্ড।
  - **System Admin:** রক্তদাতা ও অ্যাম্বুলেন্স ভেরিফিকেশন এবং কেন্দ্রীয় ডিসপ্যাচ কমান্ড সেন্টার।

---

## ২. কী কী টেকনোলজি ও টুল ব্যবহার করা হয়েছে (Tech Stack Used)

### কোর ফ্রন্টএন্ড (Core Frontend)
- **React 19 / React DOM:** আধুনিক কম্পোনেন্ট-বেসড ইউজার ইন্টারফেস লাইব্রেরি।
- **TypeScript:** টাইপ-সেফ কোডিংয়ের জন্য (ডাটা মডেল, ইন্টারফেস ও বাগ প্রতিরোধে)।
- **Vite:** দ্রুততম বান্ডলার ও লোকাল ডেভেলপমেন্ট সার্ভার।

### স্টাইলিং ও ডিজাইন (Styling & Design System)
- **Tailwind CSS:** ইউটিলিটি ফার্স্ট সিএসএস ফ্রেমওয়ার্ক।
  - কাস্টম ইমার্জেন্সি কালার প্যালেট (`primary: #D32F2F`, `secondary: #1976D2`, `success: #2E7D32`)।
  - ইমার্জেন্সি পালস ও বীকন অ্যানিমেশন (`pulse-fast`, `beacon`, `siren`)।
- **PostCSS & Autoprefixer:** সিএসএস প্রসেসিং ও ব্রাউজার কম্প্যাটিবিলিটির জন্য।
- **Google Fonts:** `Outfit` (হেডিংয়ের জন্য) এবং `Plus Jakarta Sans` (বডির জন্য)।

### আইকন ও ইউআই কম্পোনেন্ট (Icons & UI)
- **Lucide React:** আধুনিক ও পরিষ্কার মেডিকেল ও নেভিগেশন আইকন (যেমন: `Ambulance`, `HeartHandshake`, `MapPin`, `Phone`, `ShieldAlert`, ইত্যাদি)।

### ম্যাপ ও জিওলোকেশন (Maps & Geolocation)
- **Leaflet.js (`leaflet`, `@types/leaflet`):** লাইটওয়েট ও দ্রুতগতির ইন্টারেক্টিভ ম্যাপ লাইব্রেরি।
- **OpenStreetMap Tiles:** ফ্রি ও বিস্তারিত রাস্তার ম্যাপ টাইলস।
- **MapLibre GL Leaflet (`@maplibre/maplibre-gl-leaflet`, `maplibre-gl`):** অ্যাডভান্সড ভেক্টর টাইলস ও ম্যাপ রেন্ডারিং সাপোর্ট।
- **HTML5 Geolocation API:** ব্রাউজারের মাধ্যমে ইউজারের বর্তমান অক্ষাংশ-দ্রাঘিমাংশ (Latitude/Longitude) ডিটেক্ট করা।
- **Nominatim OpenStreetMap API:** রিভার্স জিওকোডিং (অক্ষাংশ/দ্রাঘিমাংশ থেকে এলাকা বা রাস্তার নাম বের করা)।

### অ্যালগরিদম ও ডেটা লজিক (Algorithms & Math)
- **Haversine Formula (`src/utils/geo.ts`):** পৃথিবীর গোলকীয় পৃষ্ঠের ওপর দুই বিন্দুর মধ্যকার আসল দূরত্ব (কিলোমিটারে) হিসাব করার জন্য।
- **Intelligent Area Search Engine (`src/utils/areaSearch.ts`):** ঢাকার সব এলাকা (রামপুরা, বনশ্রী, ধানমন্ডি, মিরপুর, উত্তরা ইত্যাদি) ও দেশের বিভাগের জন্য স্মার্ট মাল্টি-টোকেন ও বাংলা-ইংরেজি অ্যালিয়াস র‍্যাংকিং অ্যালগরিদম।

### স্টেট ম্যানেজমেন্ট ও স্টোরেজ (State & Storage)
- **React Context API (`AppContext.tsx`):** গ্লোবাল স্টেট (হাসপাতাল লিস্ট, ডোনার, অ্যাম্বুলেন্স, কারেন্ট ইউজার, কারেন্ট ট্যাব, ফিল্টার) হ্যান্ডেল করার জন্য।
- **Browser LocalStorage:** ইউজার ডাটা, ফিল্টার, এবং স্ট্যাটাস ব্রাউজারে সেভ রাখার জন্য যাতে রিফ্রেশ দিলেও মুছে না যায়।

### কোড কোয়ালিটি ও লিটিং (Linting)
- **Oxlint:** দ্রুতগতির হাই-পারফরম্যান্স জাভাস্ক্রিপ্ট/টাইপস্ক্রিপ্ট লিন্টার।

---

## ৩. প্রজেক্টের আর্কিটেকচার ও ফাইল স্ট্রাকচার (File Structure)

```text
Emergency Healthcare project/
├── index.html                   # প্রধান HTML এন্ট্রি ফাইল
├── package.json                 # প্রজেক্টের প্যাকেজ ও ডিপেন্ডেন্সি তালিকা
├── tailwind.config.js           # কাস্টম থিম ও কালার কনফিগারেশন
├── vite.config.ts               # Vite প্লাগিন ও সার্ভার কনফিগারেশন
├── push.bat                     # গিটহাবে পুশ করার ওয়ান-ক্লিক ব্যাচ স্ক্রিপ্ট
│
└── src/
    ├── main.tsx                 # রিঅ্যাক্ট অ্যাপ মাউন্ট করার ফাইল
    ├── App.tsx                  # মূল রুট কম্পোনেন্ট ও লেআউট (Navbar, Footer, Modals)
    ├── index.css                # গ্লোবাল সিএসএস ও ফন্ট ইমপোর্ট
    │
    ├── context/
    │   └── AppContext.tsx       # সম্পূর্ণ অ্যাপের গ্লোবাল স্টেট ও ফাংশনসমূহ
    │
    ├── types/
    │   └── index.ts             # TypeScript ইন্টারফেস (Hospital, Ambulance, Donor, User)
    │
    ├── data/
    │   ├── allHospitalsData.ts  # সরকারি ও বেসরকারি হাসপাতালের বিস্তারিত ডাটাবেস
    │   ├── dhakaComprehensiveHospitals.ts # ঢাকার এরিয়া ভিত্তিক হাসপাতাল তালিকা
    │   ├── mockData.ts          # অ্যাম্বুলেন্স, রক্তদাতা, প্রাথমিক ইউজার ও জরুরি হটলাইন
    │   └── facilityStats.ts     # বিভাগ ও সুবিধাভিত্তিক পরিসংখ্যন ডাটা
    │
    ├── utils/
    │   ├── geo.ts               # Haversine দূরত্ব গণনা লজিক
    │   └── areaSearch.ts        # এরিয়া সার্চ ও হাসপাতাল র‍্যাংকিং অ্যালগরিদম
    │
    ├── views/                   # পেজ বা ট্যাব ভিউসমূহ
    │   ├── HomeView.tsx         # হোম পেজ (হিরো, সার্চ, ফিল্টার, ম্যাপ ও তালিকা)
    │   ├── HospitalsView.tsx    # সম্পূর্ণ হাসপাতাল ডিরেক্টরি ও ফিল্টার ভিউ
    │   ├── BloodView.tsx        # রক্তদাতা অনুসন্ধান ও রেজিস্ট্রেশন ভিউ
    │   └── AmbulanceView.tsx    # অ্যাম্বুলেন্স কল ও লাইভ ট্র্যাকিং ভিউ
    │
    └── components/              # পুনর্ব্যবহারযোগ্য UI কম্পোনেন্টস
        ├── Navbar.tsx           # টপ হেডার ও রোল সুইচার ড্রপডাউন
        ├── MobileBottomNav.tsx  # মোবাইলের নিচের ফ্লোটিং নেভিগেশন বার
        ├── EmergencyButton.tsx  # পালসিং রেড ইমার্জেন্সি কল বাটন
        ├── EmergencyRequestModal.tsx # জরুরি রিকোয়েস্ট তৈরি ও লাইভ ট্র্যাকিং পপআপ
        ├── HospitalCard.tsx     # হাসপাতালের কার্ড কম্পোনেন্ট
        ├── HospitalDetailsModal.tsx # হাসপাতালের ১০টি সুবিধার বিস্তারিত পপআপ
        ├── Map.tsx              # Leaflet লাইভ ম্যাপ কম্পোনেন্ট
        ├── SearchBar.tsx        # লাইভ সাজেশনের সাথে সার্চ বার
        ├── FilterPanel.tsx      # দূরত্ব ও আইসিইউ/অক্সিজেন ফিল্টার প্যানেল
        ├── DonorCard.tsx        # রক্তদাতার তথ্য কার্ড
        ├── DonorRegisterModal.tsx # রক্তদাতা হওয়ার ফর্ম পপআপ
        ├── AmbulanceCard.tsx    # অ্যাম্বুলেন্স বুকিং ও কল কার্ড
        ├── HospitalDashboard.tsx # হাসপাতাল কর্তৃপক্ষের জন্য বেড আপডেট ড্যাশবোর্ড
        ├── AmbulanceDashboard.tsx# অ্যাম্বুলেন্স ড্রাইভারের স্ট্যাটাস ড্যাশবোর্ড
        ├── AdminDashboard.tsx   # ডিজিএইচএস/সিস্টেম অ্যাডমিন ড্যাশবোর্ড
        ├── AuthModal.tsx        # লগইন ও সাইনআপ পপআপ
        ├── SafetyDisclaimer.tsx # স্বাস্থ্য সতর্কবার্তা ব্যানার
        └── Footer.tsx           # ফুটার কম্পোনেন্ট
```

---

## ৪. অ্যাপ্লিকেশন কীভাবে কাজ করে (How the App Works)

### ক. লাইভ লোকেশন ডিটেকশন ও দূরত্ব গণনা:
1. ইউজার সাইটে প্রবেশ করলে `AppContext.tsx` ব্রাউজারের `navigator.geolocation` দিয়ে ইউজারের লোকেশন (Lat, Lng) নেয়।
2. `Nominatim` API দিয়ে জিপিএস পজিশন থেকে এলাকার নাম (যেমন: "Panthapath, Dhaka") বের করে।
3. ইউজারের জিপিএস পজিশন পরিবর্তন হলে `calculateDistanceKm()` দিয়ে প্রতিটি হাসপাতাল ও অ্যাম্বুলেন্সের দূরত্ব রিয়েলটাইমে রি-ক্যালকুলেট হয়।

### খ. জরুরি সহায়তা মোড (Emergency Dispatch Flow):
1. ইউজার **"GET EMERGENCY HELP"** বাটনে চাপ দিলে `EmergencyRequestModal` খোলে।
2. ইউজার ৪টি অপশন পায়: `Ambulance`, `Blood`, `Hospital`, `ICU / NICU`।
3. সিলেক্ট করার সাথে সাথে `requestEmergencyAssistance()` ফাংশন কল হয়:
   - স্বয়ংক্রিয়ভাবে নিকটবর্তী ফ্রি অ্যাম্বুলেন্স বা রক্তদাতার সাথে কানেক্ট করে।
   - একটি ইউনিক রিকোয়েস্ট আইডি (যেমন: `EMG-102938`) তৈরি হয়।
   - লাইভ স্ট্যাটাস ট্র্যাকার শুরু হয়: `Searching` ➔ `Resource Assigned` ➔ `Direct Call Button`।

### গ. এলাকা ভিত্তিক সার্চিং ও র‍্যাংকিং:
- ইউজার সার্চ বারে যেকোনো এলাকার নাম লিখলে (যেমন: "মিরপুর", "ধানমন্ডি", "Rampura") `areaSearch.ts`-এর `filterAndRankHospitals()` ফাংশন ওই এলাকার সেন্ট্রাল কোঅর্ডিনেট খুঁজে বের করে এবং ওই এলাকার কাছের হাসপাতালগুলোকে সবার উপরে র‍্যাংক করে সাজায়।

### ঘ. মাল্টি-রোল ড্যাশবোর্ড (Role Switcher):
- ওপরের নেভিগেশন বারের ড্রপডাউন থেকে রোল পরিবর্তন করা যায়:
  - **Citizen / Patient:** সাধারণ ব্যবহারকারী হিসেবে সেবা দেখা ও কল করা।
  - **Hospital Staff:** সরাসরি হাসপাতালের আইসিইউ/সাধারণ সিট সংখ্যা ও জরুরি হটলাইন এডিট করা।
  - **Ambulance Driver:** নিজের অবস্থান `Available`, `Busy` বা `Offline` করা।
  - **Admin:** নতুন হাসপাতাল বা ডোনার ভেরিফাই করা এবং সিস্টেমের পরিসংখ্যান দেখা।

---

## ৫. কীভাবে এই প্রজেক্টে কাজ করবেন (How to Develop & Add Features)

### ১. লোকাল কম্পিউটারে রান করার নিয়ম:
প্রজেক্ট ফোল্ডারে টার্মিনাল/পাওয়ারশেল খুলে রান করুন:
```bash
# ডিপেন্ডেন্সি ইন্সটল করতে (প্রথমবার):
npm install

# ডেভেলপমেন্ট সার্ভার চালু করতে:
npm run dev
```
তারপর ব্রাউজারে `http://localhost:5173/` লিঙ্কে ভিজিট করুন।

### ২. নতুন কোনো হাসপাতাল যোগ করতে চাইলে:
- ওপেন করুন: `src/data/allHospitalsData.ts` অথবা `src/data/mockData.ts`।
- সেখানে একটি নতুন অবজেক্ট যোগ করুন:
```typescript
{
  id: 'hosp-custom-01',
  name: 'Your Hospital Name',
  banglaName: 'আপনার হাসপাতালের নাম',
  code: '10009999',
  type: 'Private Tertiary',
  division: 'Dhaka',
  district: 'Dhaka',
  upazila: 'Gulshan',
  address: 'Plot 12, Road 4, Gulshan-2, Dhaka',
  phone: '+880 2 9880000',
  emergencyHotline: '+880 1711 000000',
  lat: 23.7925,
  lng: 90.4078,
  distanceKm: 0,
  rating: 4.8,
  reviewCount: 120,
  image: 'https://images.unsplash.com/...',
  bedCount: 250,
  facilities: {
    emergency: 'available',
    icu: 'available',
    nicu: 'available',
    ccu: 'available',
    hdu: 'available',
    ot: 'available',
    bloodBank: 'available',
    oxygen: 'available',
    ventilator: 'available',
    pharmacy: 'available',
  },
  lastUpdated: 'Just now',
  verified: true,
  mohfwVerified: true,
}
```

### ৩. নতুন কোনো পেজ বা ট্যাব যোগ করতে চাইলে:
1. `src/types/index.ts`-এ গিয়ে ট্যাবের নাম ডিফাইন করুন।
2. `src/views/` ফোল্ডারে নতুন কম্পোনেন্ট তৈরি করুন (যেমন: `HealthTipsView.tsx`)।
3. `src/App.tsx`-এ `renderActiveView()` ফাংশনে নতুন কেস যোগ করুন:
   ```tsx
   case 'health-tips':
     return <HealthTipsView />;
   ```
4. `src/components/Navbar.tsx` ও `MobileBottomNav.tsx`-এ মেনু আইটেম যুক্ত করুন।

### ৪. গ্লোবাল স্টেট পরিবর্তন করতে চাইলে:
- কোনো নতুন ডাটা শেয়ার করতে চাইলে `src/context/AppContext.tsx`-এ স্টেট এবং মেথড ডিফাইন করুন।
- যেকোনো কম্পোনেন্ট থেকে খুব সহজে এক্সেস করুন:
  ```tsx
  import { useApp } from '../context/AppContext';

  const MyComponent = () => {
    const { hospitals, currentUser, requestEmergencyAssistance } = useApp();
    // ব্যবহার করুন
  };
  ```

---

## ৬. কমান্ডসমূহ ও গিট গাইড (Commands & Deployment)

| কমান্ড | কাজ |
|---|---|
| `npm run dev` | লোকাল ডেভেলপমেন্ট সার্ভার চালু করে (Hot Reloading সহ)। |
| `npm run build` | প্রোডাকশনের জন্য অপ্টিমাইজড বান্ডেল তৈরি করে `dist/` ফোল্ডারে। |
| `npm run preview` | তৈরি করা বিল্ড লোকালি চালিয়ে টেস্ট করতে। |
| `npm run lint` | কোডের সিনট্যাক্স ও কোয়ালিটি যাচাই করতে Oxlint রান করে। |
| `push.bat` | প্রজেক্ট ফোল্ডারে থাকা স্ক্রিপ্ট ডাবল ক্লিক করে এক ক্লিকে গিটহাবে পুশ করার জন্য। |

---

## 💡 টিপস ও পরামর্শ
- **রিয়েলটাইম লোকালস্টোরেজ:** অ্যাপটি টেস্ট করার সময় ব্রাউজার রিফ্রেশ দিলে ডাটা মুছে যায় না, কারণ এটি `localStorage`-এ স্বয়ংক্রিয়ভাবে সেভ হয়। ডাটা একদম ফ্রেশ করতে চাইলে ব্রাউজারের `Application > Local Storage` ক্লিয়ার করতে পারেন।
- **ডিজাইন পরিবর্তন:** কালার পরিবর্তন করতে চাইলে শুধুমাত্র `tailwind.config.js`-এর `colors.primary` বা `colors.secondary` পরিবর্তন করলেই পুরো ওয়েবসাইটে এক সাথে পরিবর্তন হবে।
