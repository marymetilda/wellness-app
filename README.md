# AI Wellness Tracker

An AI-powered wellness tracking application built with:

- React Native (Expo) mobile app
- React + Vite admin dashboard
- Supabase backend
- Supabase Edge Functions
- OpenAI integration for AI meal analysis

---

# Project Structure

```txt
wellness-app/
├── apps/
│   ├── mobile/
│   └── web/
├── supabase/
│   ├── functions/
│   └── migrations/
└── README.md
```

---

# Features

## Mobile App

- User authentication
- Meal logging
- AI-generated calorie and nutrition analysis
- Daily meal history
- Wellness tracking

## Admin Dashboard

- Admin login
- View all users
- View all meals
- Monitor wellness data
- Protected admin-only routes

## Backend

- Supabase authentication
- PostgreSQL database
- Row Level Security (RLS)
- Edge Functions
- OpenAI API integration

---

# Tech Stack

## Frontend

### Mobile

- React Native
- Expo
- TypeScript

### Web Dashboard

- React
- Vite
- TypeScript

## Backend

- Supabase
- PostgreSQL
- Supabase Edge Functions

## AI

- OpenAI API

---

# Requirements

Install the following before starting:

- Node.js >= 20.19.4
- npm
- Expo CLI
- Supabase CLI
- Android Studio

---

# Installation

## Clone the Repository

```bash
git clone <your-repository-url>
cd wellness-app
```

---

# Install Dependencies

## Mobile App

```bash
cd apps/mobile
npm install
```

## Web Dashboard

```bash
cd ../web
npm install
```

---

# Supabase Setup

## Create a Supabase Project

Create a new project from:

https://supabase.com

---

# Database Schema

## Profiles Table

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc', now())
);
```

---

## Meals Table

```sql
create table meals (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  meal_name text not null,
  calories integer,
  protein integer,
  carbs integer,
  fats integer,
  ai_response text,
  created_at timestamp with time zone default timezone('utc', now())
);
```

---

# Enable Row Level Security

```sql
alter table profiles enable row level security;
alter table meals enable row level security;
```

---

# Profiles Policies

## Users Can Read Their Own Profile

```sql
create policy "Users can view own profile"
on profiles
for select
using (
  id = auth.uid()
);
```

---

## Users Can Update Their Own Profile

```sql
create policy "Users can update own profile"
on profiles
for update
using (
  id = auth.uid()
);
```

---

# Admin Helper Function

```sql
create or replace function is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;
```

---

# Admin Policy

```sql
create policy "Admins can view all profiles"
on profiles
for select
using (
  is_admin()
);
```

---

# Meals Policies

## Users Can Insert Their Own Meals

```sql
create policy "Users can insert own meals"
on meals
for insert
with check (
  user_id = auth.uid()
);
```

---

## Users Can View Their Own Meals

```sql
create policy "Users can view own meals"
on meals
for select
using (
  user_id = auth.uid()
);
```

---

## Admins Can View All Meals

```sql
create policy "Admins can view all meals"
on meals
for select
using (
  is_admin()
);
```

---

# Environment Variables

## Mobile App

Create:

```txt
apps/mobile/.env
```

Add:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Web Dashboard

Create:

```txt
apps/web/.env
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# Running the Mobile App

```bash
cd apps/mobile
npx expo start
```

---

# Running the Web Dashboard

```bash
cd apps/web
npm run dev
```

---

# Creating an Admin User

After signing up normally, run this SQL query:

```sql
update profiles
set role = 'admin'
where email = 'your-email@example.com';
```

---

# Supabase Edge Function

## Create Function

```bash
supabase functions new analyze-meal
```

---

## Deploy Function

```bash
supabase functions deploy analyze-meal
```

---

# OpenAI API Setup

Add your OpenAI API key:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

---

# Example AI Prompt

```txt
Analyze this meal and provide:
- Estimated calories
- Protein
- Carbohydrates
- Fats
- Health suggestions

Meal:
Chicken rice and salad
```

---

# Common Errors

## Infinite Recursion in Profiles Policy

Error:

```json
{
  "code": "42P17",
  "message": "infinite recursion detected in policy for relation \"profiles\""
}
```

Cause:
- A policy is querying the `profiles` table from inside another `profiles` policy.

Fix:
- Use a `SECURITY DEFINER` helper function like `is_admin()` instead of directly querying `profiles` inside policies.

---

# Recommended Folder Structure

```txt
apps/mobile/src/
├── components/
├── screens/
├── lib/
├── services/
├── types/
└── hooks/
```

```txt
apps/web/src/
├── pages/
├── components/
├── lib/
├── hooks/
└── types/
```

---

# Build Commands

## Android APK

```bash
eas build -p android
```

## Web Production Build

```bash
npm run build
```

---

# Future Improvements

- Charts and analytics
- Push notifications
- AI wellness recommendations
- Water tracking
- Workout tracking
- Dark mode
- Admin analytics dashboard

---

# Author

Mary Metilda

Software Developer