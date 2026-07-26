import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  HelpCircle
} from 'lucide-react';
import { getWMOInfo } from '../utils/weatherUtils';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = 1, className = 'w-8 h-8', size }) => {
  const info = getWMOInfo(code, isDay);

  const iconProps = {
    className,
    size: size ? size : undefined,
  };

  switch (info.iconName) {
    case 'Sun':
      return <Sun {...iconProps} className={`${className} text-amber-500 animate-pulse`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${className} text-amber-400`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-cyan-500`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`${className} text-blue-500`} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} className={`${className} text-sky-300`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${className} text-purple-500`} />;
    case 'Wind':
      return <Wind {...iconProps} className={`${className} text-teal-500`} />;
    default:
      return <HelpCircle {...iconProps} className={`${className} text-gray-400`} />;
  }
};
