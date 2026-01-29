import iconSunny from '../assets/images/icon-sunny.webp';
import iconPartlyCloudy from '../assets/images/icon-partly-cloudy.webp';
import iconOvercast from '../assets/images/icon-overcast.webp';
import iconFog from '../assets/images/icon-fog.webp';
import iconDrizzle from '../assets/images/icon-drizzle.webp';
import iconRain from '../assets/images/icon-rain.webp';
import iconSnow from '../assets/images/icon-snow.webp';
import iconStorm from '../assets/images/icon-storm.webp';

export const getWeatherIcon = (code: number): string => {
  switch (code) {
    case 0:
      return iconSunny;
    case 1:
    case 2:
      return iconPartlyCloudy;
    case 3:
      return iconOvercast;
    case 45:
    case 48:
      return iconFog;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return iconDrizzle;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return iconRain;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return iconSnow;
    case 95:
    case 96:
    case 99:
      return iconStorm;
    default:
      return iconSunny; // Default fallback
  }
};

export const getWeatherDescription = (code: number): string => {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Fog';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 56:
    case 57:
      return 'Freezing Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing Rain';
    case 71:
    case 73:
    case 75:
      return 'Snow';
    case 77:
      return 'Snow Grains';
    case 80:
    case 81:
    case 82:
      return 'Rain Showers';
    case 85:
    case 86:
      return 'Snow Showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with Hail';
    default:
      return 'Unknown';
  }
};
