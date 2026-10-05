import React from 'react';
import { FacilityStatusType } from '../types';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

interface FacilityStatusProps {
  status: FacilityStatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FacilityStatus: React.FC<FacilityStatusProps> = ({
  status,
  label,
  size = 'md',
  showLabel = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          icon: CheckCircle2,
          text: 'Available',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
          symbol: '🟢',
        };
      case 'limited':
        return {
          icon: AlertCircle,
          text: 'Limited Beds',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
          symbol: '🟡',
        };
      case 'unavailable':
        return {
          icon: XCircle,
          text: 'Full / Unavailable',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500',
          symbol: '🔴',
        };
      case 'unknown':
      default:
        return {
          icon: HelpCircle,
          text: 'Unknown / Unverified',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-400',
          symbol: '⚪',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.badgeClass} ${sizeClasses[size]}`}
      role="status"
      aria-label={`${label ? `${label}: ` : ''}${config.text}`}
      title={`${label ? `${label}: ` : ''}${config.text}`}
    >
      <span className="flex-shrink-0 w-2 h-2 rounded-full relative">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass}`}></span>
      </span>
      {label && <span className="font-semibold text-slate-700">{label}:</span>}
      {showLabel && <span>{config.text}</span>}
    </div>
  );
};
