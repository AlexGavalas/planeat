# Planeat Application Specification

This document describes the features, data model, and architecture of the Planeat application to allow another agent to recreate it from scratch.

## 1. Project Overview
Planeat is a health and wellness tracking application focused on nutrition and body metrics. It allows users to track their weight, body fat, plan meals via a calendar, and connect with other users (specifically nutritionists).

### Core Tech Stack
- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling/UI**: Mantine UI
- **Database/Backend**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Data Visualization**: Nivo Charts
- **Internationalization**: i18next / next-i18next

---

## 2. Feature Set

### A. Health & Wellness Tracking
- **BMI & Weight Monitoring**: 
    - Input weight measurements.
    - Calculate and display current BMI based on user height.
    - Visualize weight trends over time using line charts.
- **Body Fat Analysis**:
    - Input body fat percentage.
    - Visualize fat percentage trends over time.
- **Activity Tracking**:
    - Log daily activities (exercise, hydration).

### B. Dietary Planning
- **Meal Planning Calendar**:
    - A weekly calendar view to assign meals to specific days and time slots (sections).
    - Batch update functionality for meal plans.
- **Meal Pool**:
    - A personal repository of meals that can be reused in the planning calendar.
- **Dietary Preferences**:
    - Management of positive (likes) and negative (dislikes/allergies) food preferences in user settings.

### C. Social & Collaboration
- **User Discovery**:
    - Search for other users by name.
    - Distinguish between regular users and certified nutritionists.
- **Connection System**:
    - Send, accept, or reject connection requests.
    - Manage a list of current connections.
- **Notifications**:
    - System to notify users of pending connection requests.

### D. User Management & Onboarding
- **Onboarding Flow**:
    - New users are prompted to complete a profile setup (height, target weight, food preferences) before full app access.
- **Profile Settings**:
    - Manage personal details, physical measurements, and account language.
    - Account deletion functionality.

---

## 3. Data Model (Database Schema)

### Tables
- **`users`**
    - `id` (bigint, PK)
    - `email` (text, Unique)
    - `full_name` (text)
    - `is_nutritionist` (boolean)
    - `height` (double precision)
    - `target_weight` (double precision)
    - `language` (text)
    - `food_preferences_positive` (text)
    - `food_preferences_negative` (text)
    - `has_completed_onboarding` (boolean)
    - `created_at` (timestamp w/tz)

- **`meals`**
    - `id` (uuid, PK)
    - `user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `meal` (text)
    - `section_key` (text) - (e.g., Breakfast, Lunch, Dinner)
    - `day` (timestamp w/tz)
    - `note` (text)
    - `rating` (double precision)

- **`measurements`**
    - `id` (uuid, PK)
    - `user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `date` (date)
    - `weight` (double precision)
    - `fat_percentage` (double precision)

- **`activities`**
    - `id` (uuid, PK)
    - `user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `date` (date)
    - `activity` (text)

- **`meals_pool`**
    - `id` (bigint, PK)
    - `user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `content` (text)

- **`connections`**
    - `id` (uuid, PK)
    - `user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `connection_user_id` (bigint, FK $\rightarrow$ `users.id`)

- **`notifications`**
    - `id` (uuid, PK)
    - `request_user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `target_user_id` (bigint, FK $\rightarrow$ `users.id`)
    - `date` (date)
    - `notification_type` (text)

---

## 4. Application Structure & Logic

### Routing (Next.js Pages Router)
- `/` $\rightarrow$ Landing page.
- `/home` $\rightarrow$ Dashboard (Current BMI/Fat, Daily Meals).
- `/meal-plan` $\rightarrow$ Weekly Calendar view for meal planning.
- `/connections` $\rightarrow$ Search and manage user connections.
- `/settings` $\rightarrow$ Profile, Health measurements, and Account settings.

### Key User Flows
1. **Authentication**: NextAuth $\rightarrow$ Session Check $\rightarrow$ Onboarding Check $\rightarrow$ Dashboard.
2. **Meal Planning**: `Calendar Component` $\rightarrow$ Select Day/Section $\rightarrow$ Enter Meal $\rightarrow$ `PATCH /api/v1/meal` (Batch update).
3. **Health Tracking**: `Fab Button` $\rightarrow$ Add Measurement $\rightarrow$ Update `measurements` table $\rightarrow$ Update Line Chart.
4. **Connecting**: Search User $\rightarrow$ Send Request $\rightarrow$ Target User receives `notification` $\rightarrow$ Accept $\rightarrow$ Entry created in `connections`.

### API Architecture
The app uses REST-like endpoints in `/api/v1/` to handle CRUD operations for:
- `user` (Profile updates, search)
- `meal` (Plan management)
- `measurement` (Weight/Fat tracking)
- `connection` (Friendship logic)
- `activity` (Log tracking)
