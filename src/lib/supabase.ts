import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'PASTE_YOUR_SUPABASE_URL_HERE' &&
    supabaseAnonKey !== 'PASTE_YOUR_PUBLISHABLE_KEY_HERE' &&
    supabaseUrl.startsWith('https://')
  );
};

// Safe fallback URL/Key to avoid crashing client constructor if env vars are missing
const safeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-project.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const SQL_SCHEMA_SETUP = `-- LUMINA DENTAL STUDIO SCHEMA SETUP SCRIPT
-- Paste this in Supabase SQL Editor and click RUN

-- 1. Services Table
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  duration_minutes integer not null default 30,
  price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Appointments Table
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  service_id uuid references services(id) on delete set null,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Business Hours Table
create table if not exists business_hours (
  id uuid default gen_random_uuid() primary key,
  weekday integer not null unique, -- 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  is_open boolean not null default true,
  start_time time not null default '09:00:00',
  end_time time not null default '17:00:00'
);

-- 4. Blocked Dates Table
create table if not exists blocked_dates (
  id uuid default gen_random_uuid() primary key,
  blocked_date date not null unique,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Clinic Settings Table
create table if not exists clinic_settings (
  id uuid default gen_random_uuid() primary key,
  clinic_name text not null default 'Lumina Dental Studio',
  clinic_email text not null default 'care@luminadental.com',
  clinic_phone text not null default '+1 (555) 234-8900',
  clinic_address text not null default '742 Evergreen Terrace, Suite 300, Medical District',
  slot_interval_minutes integer not null default 30,
  booking_notice_hours integer not null default 2,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Admin Users Table (Links to Supabase auth.users.id)
create table if not exists admin_users (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) & Policies
alter table services enable row level security;
alter table appointments enable row level security;
alter table business_hours enable row level security;
alter table blocked_dates enable row level security;
alter table clinic_settings enable row level security;
alter table admin_users enable row level security;

-- Public read policies
create policy "Public can view active services" on services for select using (true);
create policy "Public can view business hours" on business_hours for select using (true);
create policy "Public can view blocked dates" on blocked_dates for select using (true);
create policy "Public can view clinic settings" on clinic_settings for select using (true);
create policy "Public can create appointments" on appointments for insert with check (true);
create policy "Public can view booked slots" on appointments for select using (true);

-- Admin full access policies (checks admin_users)
create policy "Admins have full access to services" on services for all using (
  exists (select 1 from admin_users where admin_users.user_id = auth.uid())
);
create policy "Admins have full access to appointments" on appointments for all using (
  exists (select 1 from admin_users where admin_users.user_id = auth.uid())
);
create policy "Admins have full access to business_hours" on business_hours for all using (
  exists (select 1 from admin_users where admin_users.user_id = auth.uid())
);
create policy "Admins have full access to blocked_dates" on blocked_dates for all using (
  exists (select 1 from admin_users where admin_users.user_id = auth.uid())
);
create policy "Admins have full access to clinic_settings" on clinic_settings for all using (
  exists (select 1 from admin_users where admin_users.user_id = auth.uid())
);
create policy "Admins can view admin_users" on admin_users for select using (
  user_id = auth.uid() or exists (select 1 from admin_users where admin_users.user_id = auth.uid())
);

-- Seed Initial Data
insert into clinic_settings (clinic_name, clinic_email, clinic_phone, clinic_address, slot_interval_minutes, booking_notice_hours)
values ('Lumina Dental Studio', 'care@luminadental.com', '+1 (555) 234-8900', '742 Evergreen Terrace, Suite 300, Medical District', 30, 2)
on conflict do nothing;

insert into business_hours (weekday, is_open, start_time, end_time) values
  (0, false, '10:00:00', '15:00:00'), -- Sunday (Closed)
  (1, true, '08:30:00', '18:00:00'),  -- Monday
  (2, true, '08:30:00', '18:00:00'),  -- Tuesday
  (3, true, '08:30:00', '18:00:00'),  -- Wednesday
  (4, true, '08:30:00', '18:00:00'),  -- Thursday
  (5, true, '08:30:00', '17:00:00'),  -- Friday
  (6, true, '09:00:00', '15:00:00')   -- Saturday
on conflict (weekday) do nothing;

insert into services (name, description, duration_minutes, price, is_active) values
  ('Comprehensive Dental Exam & Digital X-Rays', 'In-depth clinical assessment with high-definition digital panoramic radiographs and periodontal health screening.', 45, 140.00, true),
  ('Gentle Ultrasonic Hygiene & Polishing', 'Deep gentle prophylaxis removing plaque, calculus, and surface discoloration with air-flow polishing.', 45, 120.00, true),
  ('Advanced In-Office Laser Teeth Whitening', 'Medical-grade cold laser light technology lifting stubborn stains up to 8 shades in a single comfortable session.', 60, 290.00, true),
  ('Biocompatible Composite Tooth Restoration', 'Seamless, tooth-colored aesthetic resin filling restoring structural integrity with undetectable natural finish.', 45, 175.00, true),
  ('Urgent Dental Consultation & Pain Relief', 'Priority same-day diagnostic evaluation and targeted palliative relief for acute discomfort or chipped teeth.', 30, 95.00, true),
  ('Cosmetic Smile Design & Porcelain Veneers Consultation', 'Personalized digital smile simulation and comprehensive cosmetic restoration planning.', 45, 150.00, true)
on conflict do nothing;
`;
