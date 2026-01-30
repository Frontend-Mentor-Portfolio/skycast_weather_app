/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

// Periodic Sync Logic
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Helper to fetch weather
async function fetchWeatherForNotification(lat: number, lon: number, unit: 'metric' | 'imperial', settings: any) {
    // Suppress unused unit warning if we aren't using it for the API call yet (though we pass different params based on unit usually)
    // For now we just fetch defaults or we could use unit map.
    // Let's just use the param to avoid TS unused error
    const tempUnit = unit === 'imperial' ? 'fahrenheit' : 'celsius';
    const windUnit = unit === 'imperial' ? 'mph' : 'kmh';
    const precipUnit = unit === 'imperial' ? 'inch' : 'mm';

    try {
        const response = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=precipitation,weather_code,wind_speed_10m&minutely_15=precipitation,precipitation_probability&hourly=uv_index&timezone=auto&past_days=1&forecast_days=1&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}`);
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

// Store client state to use in background
let clientState: any = null;

// Background Sync
self.addEventListener('periodicsync', (event: any) => {
    if (event.tag === 'weather-update') {
        event.waitUntil(
            (async () => {
                console.log('Periodic sync triggered');
                if (clientState) {
                    await fetchWeatherForNotification(
                        clientState.location.latitude,
                        clientState.location.longitude,
                        clientState.unit || 'metric',
                        clientState.settings
                    );
                } else {
                    console.log('No client state available for background sync');
                }
            })()
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_STATE') {
        clientState = event.data.payload;
        console.log('SW State Updated', clientState);
    }
});

console.log('Service Worker Loaded');
