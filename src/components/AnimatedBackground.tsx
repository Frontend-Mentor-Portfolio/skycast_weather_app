import React from 'react';

interface AnimatedBackgroundProps {
  weatherCode: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ weatherCode }) => {
  // Determine weather type based on code
  let type: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' = 'sunny';

  if (weatherCode === 0 || weatherCode === 1) type = 'sunny';
  else if (weatherCode === 2 || weatherCode === 3) type = 'cloudy';
  else if ([45, 48].includes(weatherCode)) type = 'fog';
  else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) type = 'rain';
  else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) type = 'snow';
  else if ([95, 96, 99].includes(weatherCode)) type = 'storm';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Immersive Gradient Overlay */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        type === 'sunny' ? 'bg-gradient-to-br from-yellow-200/40 via-blue-200/20 to-transparent dark:from-blue-400/20 dark:via-blue-500/10' : 
        type === 'cloudy' ? 'bg-gradient-to-br from-slate-200/50 via-blue-100/30 to-transparent dark:from-slate-800/60 dark:via-blue-950/40' : 
        type === 'rain' ? 'bg-gradient-to-b from-blue-200/60 via-slate-200/40 to-transparent dark:from-blue-950/80 dark:via-black/60' : 
        type === 'snow' ? 'bg-gradient-to-b from-blue-50/40 via-white/20 to-transparent dark:from-blue-100/10 dark:via-blue-900/20' : 
        type === 'storm' ? 'bg-gradient-to-b from-slate-400/60 via-blue-200/40 to-transparent dark:from-purple-950/80 dark:via-black/60' : 'bg-slate-200/40'
      }`}></div>

      {/* Sunny: Dramatic Beams and Glow */}
      {type === 'sunny' && (
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-[150%] h-[150%] animate-[beam-rotate_25s_linear_infinite] opacity-40 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_20deg,rgba(255,255,255,0.1)_25deg,transparent_30deg)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,220,100,0.15)_0%,transparent_70%)] animate-pulse"></div>
        </div>
      )}

      {/* Cloudy & Fog: Layered Floating Mists */}
      {(type === 'cloudy' || type === 'fog') && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-white/[0.03] backdrop-blur-[2px]"></div>
          <div className="absolute top-1/4 -left-20 w-[500px] h-64 bg-white/10 rounded-full blur-[100px] animate-[float_20s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-80 bg-white/10 rounded-full blur-[120px] animate-[float_25s_ease-in-out_infinite_reverse]"></div>
          <div className="absolute top-1/2 left-1/3 w-[400px] h-40 bg-blue-200/5 rounded-full blur-[80px] animate-[float_18s_ease-in-out_infinite]"></div>
        </div>
      )}

      {/* Rain: Dense Falling Lines & Splashes */}
      {type === 'rain' && (
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-gradient-to-b from-blue-300/40 to-transparent w-[1.5px]"
              style={{
                height: `${Math.random() * 20 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animation: `rain ${0.4 + Math.random() * 0.4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                transform: 'rotate(15deg)'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Snow: Large and Small Flakes with Sway */}
      {type === 'snow' && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/60 rounded-full blur-[1px]"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animation: `snow ${4 + Math.random() * 6}s ease-in-out infinite, sway ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: 0.4 + Math.random() * 0.4
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Storm: Intense Flashes & Torrential Rain */}
      {type === 'storm' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-[lightning_4s_ease-out_infinite]"></div>
          <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[1px]"></div>
          {[...Array(60)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-gradient-to-b from-blue-200/50 to-transparent w-[2px]"
              style={{
                height: `${Math.random() * 30 + 30}px`,
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animation: `rain ${0.2 + Math.random() * 0.3}s linear infinite`,
                animationDelay: `${Math.random() * 1}s`,
                transform: 'rotate(20deg)'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground;
