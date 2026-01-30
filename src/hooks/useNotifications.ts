import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, NotificationSettings } from '../types/weather';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'alert' | 'success';
    timestamp: number;
}

export const useNotifications = (
    weather: WeatherData | null,
    settings: NotificationSettings
) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [lastNotified, setLastNotified] = useState<{ [key: string]: number }>({});

    const addNotification = useCallback((title: string, message: string, type: 'info' | 'warning' | 'alert' | 'success' = 'info') => {
        const id = Date.now().toString();
        const newNotification = { id, title, message, type, timestamp: Date.now() };

        setNotifications(prev => [newNotification, ...prev]);

        // Try browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }
    }, []);

    const clearNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Check for notifications when weather data updates
    useEffect(() => {
        if (!weather || !settings.enabled) return;

        const now = Date.now();
        const checks = async () => {
            // 1. Precipitation Start (Rain in 15 mins)
            if (settings.precipitation) {
                // Look at the first 15-30 mins (indices 0-2 roughly, assuming 15 min intervals? 
                // actually minutely data is usually 15 min steps in OpenMeteo if requested as minutely_15)
                // Let's assume the array corresponds to: Now, Now+15, Now+30, etc.
                const next15MinsRain = weather.minutely.precipitationProbability[1]; // Index 1 is +15 mins
                const currentRain = weather.minutely.precipitationProbability[0];

                // Trigger if it's going to start raining (low now, high later)
                if (currentRain < 30 && next15MinsRain > 60) {
                    const key = 'precip_start';
                    // Cooldown 6 hours
                    if (!lastNotified[key] || now - lastNotified[key] > 6 * 60 * 60 * 1000) {
                        addNotification('Precipitation Alert', 'Rain starting in about 15 minutes in your location.', 'warning');
                        setLastNotified(prev => ({ ...prev, [key]: now }));
                    }
                }
            }

            // 2. Extreme Temperature Shifts
            if (settings.tempShifts && weather.yesterday) {
                const todayMax = Math.max(...weather.daily.temperature_2m_max);
                const diff = todayMax - weather.yesterday.temperatureMax;

                if (Math.abs(diff) >= 10) {
                    const key = 'temp_shift';
                    // Cooldown 20 hours (basically once a day)
                    if (!lastNotified[key] || now - lastNotified[key] > 20 * 60 * 60 * 1000) {
                        const msg = diff > 0
                            ? `It's much warmer today! ${diff.toFixed(1)}° rise since yesterday.`
                            : `Big drop in temperature! ${Math.abs(diff).toFixed(1)}° cooler than yesterday.`;
                        addNotification('Extreme Temperature Shift', msg, 'warning');
                        setLastNotified(prev => ({ ...prev, [key]: now }));
                    }
                }
            }

            // 3. Morning Briefing (7:00 AM)
            if (settings.morningBriefing) {
                const currentHour = new Date().getHours();
                if (currentHour === 7) {
                    const key = `morning_briefing_${new Date().toDateString()}`;
                    if (!lastNotified[key]) {
                        let msg = `Today's forecast: High of ${Math.round(weather.daily.temperature_2m_max[0])}°.`;
                        if (weather.yesterday) {
                            const diff = weather.daily.temperature_2m_max[0] - weather.yesterday.temperatureMax;
                            msg += diff > 0
                                ? ` ${Math.abs(diff).toFixed(0)}° warmer than yesterday.`
                                : ` ${Math.abs(diff).toFixed(0)}° cooler than yesterday.`;
                        }
                        const rainProb = Math.max(...weather.minutely.precipitationProbability.slice(0, 4 * 12)); // Check next 12 hours approx
                        if (rainProb < 20) msg += " No rain expected—perfect for a light jacket.";

                        addNotification('Morning Briefing', msg, 'info');
                        setLastNotified(prev => ({ ...prev, [key]: now }));
                    }
                }
            }

            // 4. Severe Weather Warnings
            if (settings.severeWeather) {
                // high wind > 80kmh (approx 50mph)
                if (weather.current.windSpeed > 80) {
                    const key = 'severe_wind';
                    if (!lastNotified[key] || now - lastNotified[key] > 4 * 60 * 60 * 1000) {
                        addNotification('Severe Weather Warning', 'High velocity winds detected. Stay safe!', 'alert');
                        setLastNotified(prev => ({ ...prev, [key]: now }));
                    }
                }
                // Thunderstorm codes: 95, 96, 99
                if ([95, 96, 99].includes(weather.current.weatherCode)) {
                    const key = 'severe_storm';
                    if (!lastNotified[key] || now - lastNotified[key] > 4 * 60 * 60 * 1000) {
                        addNotification('Severe Weather Warning', 'Thunderstorms detected in your area.', 'alert');
                        setLastNotified(prev => ({ ...prev, [key]: now }));
                    }
                }
            }

            // 5. Smart Outfit Advisor
            if (settings.outfitAdvisor) {
                const key = `outfit_${new Date().toDateString()}`;
                // Only trigger once a day, maybe in morning or first open
                if (!lastNotified[key]) {
                    let outfitMsg = "";
                    const temp = weather.current.temperature;
                    const isRaining = weather.current.precipitation > 0 || weather.current.weatherCode >= 51;
                    const isWindy = weather.current.windSpeed > 20;

                    if (isRaining) {
                        outfitMsg = "Don't forget your umbrella! It's raining.";
                    } else if (temp < 10) {
                        outfitMsg = "It's chilly today. Grab a heavy coat.";
                    } else if (temp >= 10 && temp < 20) {
                        if (isWindy) outfitMsg = "It's windy and cool. You'll want a windbreaker.";
                        else outfitMsg = "Mild weather. A light jacket / hoodie is perfect.";
                    } else {
                        outfitMsg = "It's warm! T-shirt weather.";
                    }

                    if (outfitMsg) {
                        addNotification('Smart Outfit Advisor', outfitMsg, 'info');
                        setLastNotified(prev => ({ ...prev, [key]: now }));
                    }
                }
            }
        };

        checks();
    }, [weather, settings, lastNotified, addNotification]);

    return {
        notifications,
        clearNotification,
        addNotification // Exported for testing/manual triggering
    };
};
