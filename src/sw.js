import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

// Periodic Sync Logic
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Helper to fetch weather (duplicated slightly to avoid heavy imports/axios)
async function fetchWeatherForNotification(lat: number, lon: number, unit: 'metric' | 'imperial', settings: any) {
    try {
        const response = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=precipitation,weather_code,wind_speed_10m&minutely_15=precipitation,precipitation_probability&hourly=uv_index&timezone=auto&past_days=1&forecast_days=1`);
        const data = await response.json();

        // Simple checks for notifications
        const next15MinsRain = data.minutely_15?.precipitation_probability?.[1] || 0;
        const currentRain = data.minutely_15?.precipitation_probability?.[0] || 0;

        if (settings.precipitation && currentRain < 30 && next15MinsRain > 60) {
            self.registration.showNotification('Precipitation Alert', {
                body: 'Rain starting in about 15 minutes in your location.',
                icon: '/icon.svg'
            });
        }

        if (settings.severeWeather && data.current.wind_speed_10m > 80) {
            self.registration.showNotification('Severe Weather Warning', {
                body: 'High velocity winds warning!',
                icon: '/icon.svg'
            });
        }

    } catch (err) {
        console.error('SW Weather Fetch Error', err);
    }
}

// Background Sync (Fallback or actual Background Sync API)
self.addEventListener('periodicsync', (event: any) => {
    if (event.tag === 'weather-update') {
        event.waitUntil(
            (async () => {
                // We need to get location/settings from IndexedDB or assume defaults
                // Since we can't easily access localStorage in SW.
                // For MVP, we'll try to get it from a simple cache or message
                // But realistically, we need IndexedDB. 
                // For now, let's just log or try a hardcoded default if storage is missing
                console.log('Periodic sync triggered');
                // Realistically we need to read state from IDB here. 
            })()
        );
    }
});

// Listen for messages from Client to update state
let clientState: any = null;
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_STATE') {
        clientState = event.data.payload;
    }
});

// On Push (if we had it)
// self.addEventListener('push', ...)

console.log('Service Worker Loaded');
