export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Region
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  isDay: number;
  time: string;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  uv_index?: number[];
  visibility?: number[];
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
    precipitation: string;
    relative_humidity_2m: string;
    uv_index: string;
    visibility: string;
    surface_pressure: string;
  };
}

export type UnitSystem = 'metric' | 'imperial';
