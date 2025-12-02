<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1qMakYU_iVC_NXsU1ojPfufhO28CJVrHB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set your Supabase project URL and anon key in `.env`:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Database Setup

This app uses Supabase as the backend. The database schema includes:
- **apps**: Application showcase entries
- **app_requests**: User feature requests
- **help_requests**: Help requests from developers
- **comments**: Comments for apps and help requests
- **price_votes**: User votes on app pricing
- **likes**: App likes by users
- **request_votes**: Votes on feature requests

All tables have RLS (Row Level Security) enabled with public read/write access.

## Authentication Setup

This app supports email and Kakao OAuth authentication via Supabase Auth.

### Enable Kakao OAuth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Kakao** provider
4. Follow the instructions to set up Kakao OAuth:
   - Create an app in [Kakao Developers](https://developers.kakao.com/)
   - Get your REST API Key and JavaScript Key
   - Configure redirect URIs in Kakao settings
   - Add Kakao Client ID and Client Secret to Supabase

### Features

- **Email/Password signup and login**
- **Kakao OAuth login** - 원클릭 카카오 로그인
- **Protected routes**: Only authenticated users can:
  - Register new apps
  - Create help requests
  - Submit feature requests
  - Post comments
- **User profile display** in navigation bar
- **Persistent sessions** across page reloads
