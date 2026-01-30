# SkyCast Weather App

SkyCast is a modern, feature-rich weather dashboard built with React 19 and Tailwind CSS 4. It provides real-time weather data, 7-day forecasts, and immersive animated backgrounds that adapt to current conditions and the time of day.

![SkyCast Desktop View](./screenshots/desktop-view.jpeg)
![SkyCast Tablet View](./screenshots/tablet-view.jpeg)
![SkyCast Mobile View](./screenshots/mobile-view.jpeg)

## Features

### 🌤 Core Features
- **Real-Time Weather:** Accurate current conditions including temperature, humidity, wind, UV index, visibility, and pressure.
- **7-Day Forecast:** Detailed daily and hourly forecasts to plan your week.
- **Animated Backgrounds:** Immersive particle systems (raindrops, snowflakes, sunbeams) that adapt to weather conditions and time of day.
- **Smart Location Search:** Instant location lookup with voice search capabilities.
- **Favorites System:** Bookmark your frequent locations for quick access.
- **Comparison Mode:** Compare weather side-by-side for up to 4 different places.

### 🔔 Smart Notification System [NEW]
Stay ahead of the weather with our intelligent alert system:
- **Precipitation Alerts:** "Rain starting in 15 minutes." Get notified before it pours.
- **Extreme Temperature Shifts:** Alerts for significant temperature drops or rises (>10°C) compared to yesterday.
- **Morning Briefing:** A daily 7:00 AM summary detailing forecast highs and temperature trends.
- **Severe Weather Warnings:** Immediate alerts for high winds (>80km/h) and thunderstorms.
- **Smart Outfit Advisor:** Context-aware clothing suggestions based on temperature, wind, and rain (e.g., "It's windy and 12°C. You'll want a windbreaker.").
*(Note: Notifications are managed via browser APIs and configurable in Settings)*

### 🛠 Tech Stack
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS 4 + Custom CSS Animations
- **Data Source:** Open-Meteo API (Weather), Nominatim (Geocoding)
- **State Management:** Custom React Hooks
- **PWA:** Installable on Desktop & Mobile

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/frontend-mentor-portfolio/skycast-weather-app.git
   cd skycast-weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage

- **Search:** Use the top search bar to find any city. Click the microphone icon for voice search.
- **Compare:** Click the "Compare" button to enter comparison mode, then add more cities.
- **Notifications:** Click the "Settings" (Units) button in the header to toggle specific alerts like Rain, Outfit Advisor, etc.
- **Theme:** The app automatically switches between Light and Dark modes based on your local time (Light: 6AM-6PM).

## Author

- **Frontend Mentor** - [@MhistaFortune](https://www.frontendmentor.io/profile/MhistaFortune)
- **Twitter/X** - [@fortunate_egwu](https://www.twitter.com/fortunate_egwu)

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for the challenge.
- [Open-Meteo](https://open-meteo.com/) for the free weather API.
