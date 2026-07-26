import React from 'react';
import {
  Sparkles,
  Umbrella,
  Sun,
  ThermometerSun,
  ThermometerSnowflake,
  Wind,
  Droplets,
  Car,
  SunMedium,
  CloudDrizzle,
  CloudLightning,
  ChevronRight
} from 'lucide-react';
import { SmartRecommendation } from '../types';

interface SmartAdviceCardProps {
  recommendations: SmartRecommendation[];
  cityName: string;
}

export const SmartAdviceCard: React.FC<SmartAdviceCardProps> = ({
  recommendations,
  cityName,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Umbrella':
        return <Umbrella className="w-4 h-4 text-sky-200" />;
      case 'Sun':
      case 'SunMedium':
        return <Sun className="w-4 h-4 text-amber-300" />;
      case 'ThermometerSun':
        return <ThermometerSun className="w-4 h-4 text-rose-300" />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake className="w-4 h-4 text-cyan-200" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-teal-200" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-blue-200" />;
      case 'Car':
        return <Car className="w-4 h-4 text-slate-200" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-4 h-4 text-cyan-200" />;
      case 'CloudLightning':
        return <CloudLightning className="w-4 h-4 text-purple-200" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-300" />;
    }
  };

  const topRecs = recommendations.slice(0, 2);

  return (
    <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl lg:rounded-[32px] p-5 shadow-sm border border-teal-600/50 flex flex-col justify-between gap-3 relative overflow-hidden">
      {/* Decorative peach background glow */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-100">
            Smart Planning Advice
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-orange-200 bg-orange-500/20 px-2 py-0.5 rounded-full">
          {cityName}
        </span>
      </div>

      {/* Advice list */}
      <div className="space-y-2 my-1 z-10">
        {topRecs.map((rec) => (
          <div
            key={rec.id}
            className="p-3 rounded-2xl bg-teal-900/60 border border-teal-500/20 backdrop-blur-xs flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-xl bg-teal-950/60 shrink-0 mt-0.5">
              {getIcon(rec.iconName)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-orange-100 truncate">
                {rec.title}
              </h4>
              <p className="text-[11px] text-teal-100/90 leading-snug line-clamp-2 mt-0.5">
                {rec.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-semibold text-teal-200 pt-1 border-t border-teal-600/40">
        <span>AI Weather Insights</span>
        <span className="flex items-center text-orange-300">
          Optimal Planning <ChevronRight className="w-3 h-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};

