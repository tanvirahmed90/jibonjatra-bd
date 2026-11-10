/**
 * JibonJatra BD backend client (Supabase, free tier).
 *
 * Uses Supabase's REST endpoints (GoTrue auth + PostgREST) directly with fetch, so no extra
 * npm package is needed. Security is enforced in the database by Row Level Security
 * policies — see supabase/schema.sql. The anon key is safe to ship to the browser.
 *
 * Configure with environment variables (local: .env.local, Vercel/Netlify: project settings):
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJ...
 */

const SUPABASE_URL = ((import.meta.env.VITE_SUPABASE_URL as string | undefined) || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '';

export const isBackendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const SESSION_KEY = 'jibonjatra_auth_session_v1';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  user: { id: string; email?: string };
}

export class BackendError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Session storage
// ---------------------------------------------------------------------------
function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s && s.access_token && s.refresh_token && s.user?.id) return s;
  } catch {
    // ignore
  }
  return null;
}

function writeSession(s: AuthSession | null) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

function toSession(data: any): AuthSession | null {
  if (!data?.access_token) return null;
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
    user: { id: data.user?.id, email: data.user?.email },
  };
}

function friendlyAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'ইমেইল বা পাসওয়ার্ড ভুল।';
  if (m.includes('email not confirmed')) return 'ইমেইল এখনো কনফার্ম হয়নি। ইনবক্সে পাঠানো লিংকে ক্লিক করুন।';
  if (m.includes('already registered') || m.includes('already been registered')) return 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন।';
  if (m.includes('password should be')) return 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।';
  if (m.includes('rate limit')) return 'অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
  return msg;
}

async function authFetch(path: string, body: unknown): Promise<any> {
  if (!isBackendConfigured) throw new BackendError('Backend not configured');
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BackendError(friendlyAuthError(data.error_description || data.msg || data.message || 'Auth error'), res.status);
  }
  return data;
}

let refreshing: Promise<AuthSession | null> | null = null;

async function getValidSession(): Promise<AuthSession | null> {
  const s = readSession();
  if (!s) return null;
  const now = Math.floor(Date.now() / 1000);
  if (s.expires_at - now > 60) return s;

  if (!refreshing) {
    refreshing = authFetch('token?grant_type=refresh_token', { refresh_token: s.refresh_token })
      .then(data => {
        const ns = toSession(data);
        writeSession(ns);
        return ns;
      })
      .catch(() => {
        writeSession(null);
        return null;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------
export type SelfRegisterRole = 'donor' | 'ambulance';

export const auth = {
  async getSession() {
    return getValidSession();
  },

  async signIn(email: string, password: string): Promise<AuthSession> {
    const data = await authFetch('token?grant_type=password', { email: email.trim(), password });
    const s = toSession(data);
    if (!s) throw new BackendError('লগইন ব্যর্থ হয়েছে।');
    writeSession(s);
    return s;
  },

  /** Returns a session, or null when the project requires email confirmation first. */
  async signUp(input: { email: string; password: string; name: string; phone: string; role: SelfRegisterRole }) {
    const data = await authFetch('signup', {
      email: input.email.trim(),
      password: input.password,
      // role here is only a request — the database trigger only ever allows donor/ambulance
      data: { name: input.name.trim(), phone: input.phone.trim(), role: input.role },
    });
    const s = toSession(data);
    if (s) writeSession(s);
    return s;
  },

  async signOut() {
    const s = readSession();
    writeSession(null);
    if (s && isBackendConfigured) {
      fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${s.access_token}` },
      }).catch(() => {});
    }
  },

  async resetPassword(email: string) {
    await authFetch('recover', { email: email.trim() });
  },
};

// ---------------------------------------------------------------------------
// Database (PostgREST)
// ---------------------------------------------------------------------------
async function rest<T = any>(
  path: string,
  init: { method?: string; body?: unknown; prefer?: string; requireAuth?: boolean } = {}
): Promise<T> {
  if (!isBackendConfigured) throw new BackendError('Backend not configured');
  const session = await getValidSession();
  if (init.requireAuth && !session) throw new BackendError('আগে লগইন করুন।', 401);

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
  // Logged in → send the user's JWT. Logged out → apikey alone (works with both the legacy
  // "anon" JWT key and the new "sb_publishable_..." keys, which must not be sent as a Bearer token).
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  if (init.prefer) headers.Prefer = init.prefer;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: init.method || 'GET',
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new BackendError(data.message || `Request failed (${res.status})`, res.status);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// Row shapes (snake_case, as stored in Postgres)
export interface ProfileRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'donor' | 'ambulance' | 'admin';
}
export interface DonorRow {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  blood_group: string;
  age: number | null;
  division: string | null;
  district: string | null;
  area: string | null;
  lat: number | null;
  lng: number | null;
  available: boolean;
  last_donation_date: string | null;
  verified: boolean;
  updated_at: string;
}
export interface AmbulanceRow {
  id: string;
  user_id: string;
  provider_name: string;
  driver_name: string;
  phone: string;
  vehicle_type: string;
  reg_number: string;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  status: 'available' | 'busy' | 'offline';
  verified: boolean;
  updated_at: string;
}
export interface EmergencyRow {
  id: string;
  type: string;
  patient_name: string | null;
  phone: string | null;
  blood_group: string | null;
  units_needed: number | null;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  created_at: string;
}
export interface HospitalStatusRow {
  hospital_id: string;
  facilities: Record<string, string>;
  bed_stock: Record<string, number> | null;
  phone: string | null;
  updated_at: string;
}

export const db = {
  getMyProfile: async (userId: string) =>
    (await rest<ProfileRow[]>(`profiles?id=eq.${userId}&select=*`, { requireAuth: true }))[0] || null,

  updateMyProfile: (userId: string, patch: Partial<Pick<ProfileRow, 'name' | 'phone'>>) =>
    rest(`profiles?id=eq.${userId}`, { method: 'PATCH', body: patch, requireAuth: true }),

  // Donors
  listDonors: () => rest<DonorRow[]>('donors?select=*&order=updated_at.desc&limit=2000'),
  upsertMyDonor: async (row: Partial<DonorRow> & { user_id: string }) =>
    (
      await rest<DonorRow[]>('donors?on_conflict=user_id', {
        method: 'POST',
        body: row,
        prefer: 'resolution=merge-duplicates,return=representation',
        requireAuth: true,
      })
    )[0],

  // Ambulances registered by drivers (public sees verified only — enforced by RLS)
  listAmbulances: () => rest<AmbulanceRow[]>('ambulances?select=*&order=updated_at.desc&limit=2000'),
  upsertMyAmbulance: async (row: Partial<AmbulanceRow> & { user_id: string }) =>
    (
      await rest<AmbulanceRow[]>('ambulances?on_conflict=user_id', {
        method: 'POST',
        body: row,
        prefer: 'resolution=merge-duplicates,return=representation',
        requireAuth: true,
      })
    )[0],

  // Emergency requests (anyone can create; only admins can read all)
  createEmergency: (row: Partial<EmergencyRow>) =>
    rest('emergency_requests', { method: 'POST', body: row, prefer: 'return=minimal' }),
  listEmergencies: () => rest<EmergencyRow[]>('emergency_requests?select=*&order=created_at.desc&limit=200', { requireAuth: true }),
  updateEmergencyStatus: (id: string, status: string) =>
    rest(`emergency_requests?id=eq.${id}`, { method: 'PATCH', body: { status }, requireAuth: true }),

  // Hospital live status (public read, admin write)
  listHospitalStatus: () => rest<HospitalStatusRow[]>('hospital_status?select=*'),
  upsertHospitalStatus: (row: Partial<HospitalStatusRow> & { hospital_id: string }) =>
    rest('hospital_status?on_conflict=hospital_id', {
      method: 'POST',
      body: { ...row, updated_at: new Date().toISOString() },
      prefer: 'resolution=merge-duplicates,return=minimal',
      requireAuth: true,
    }),

  // Admin verification
  setVerified: (table: 'donors' | 'ambulances', id: string, verified: boolean) =>
    rest(`${table}?id=eq.${id}`, { method: 'PATCH', body: { verified }, requireAuth: true }),
};
