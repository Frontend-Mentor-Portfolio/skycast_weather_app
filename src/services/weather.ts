import axios from 'axios';
import type { Location, WeatherData, UnitSystem } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const searchLocation = async (query: string): Promise<Location[]> => {
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        name: query,
        count: 5,
        language: 'en',
        format: 'json',
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
};

const REVERSE_GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse';

export const reverseGeocode = async (lat: number, lon: number): Promise<Location | null> => {
  try {
    const response = await axios.get(REVERSE_GEOCODING_API_URL, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'Accept-Language': 'en',
      },
    });
    const { address, lat: rLat, lon: rLon, place_id } = response.data;
    return {
      id: place_id,
      name: address.city || address.town || address.village || address.suburb || 'Current Location',
      latitude: parseFloat(rLat),
      longitude: parseFloat(rLon),
      country: address.country,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

export const getWeatherData = async (
  lat: number,
  lon: number,
  unit: UnitSystem
): Promise<WeatherData | null> => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure',
        hourly: 'temperature_2m,weather_code,uv_index,visibility',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
        timezone: 'auto',
        temperature_unit: unit === 'imperial' ? 'fahrenheit' : 'celsius',
        wind_speed_unit: unit === 'imperial' ? 'mph' : 'kmh',
        precipitation_unit: unit === 'imperial' ? 'inch' : 'mm',
      },
    });

    const data = response.data;
    
    // Find current UV index and visibility from hourly data
    // Usually index 0 is current hour if we use current time
    const currentHourIndex = data.hourly.time.findIndex((t: string) => t === data.current.time);
    const safeIndex = currentHourIndex === -1 ? 0 : currentHourIndex;
    
    const currentUvIndex = data.hourly.uv_index ? data.hourly.uv_index[safeIndex] : 0;
    const currentVisibility = data.hourly.visibility ? data.hourly.visibility[safeIndex] : 0;

    // Map API response to our internal structure
    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m || 0, // Fallback if not requested
        isDay: data.current.is_day,
        time: data.current.time,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        uvIndex: currentUvIndex,
        visibility: currentVisibility,
        pressure: data.current.surface_pressure,
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
      },
      hourly: data.hourly,
      daily: data.daily,
      current_units: {
        ...data.current_units,
        uv_index: data.hourly_units?.uv_index || '',
        visibility: data.hourly_units?.visibility || 'm',
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
