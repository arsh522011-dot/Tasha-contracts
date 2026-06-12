import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = '', size }) => {
  // Graceful fallback to Building2 if icon not found
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Building2;
  return <IconComponent className={className} size={size} />;
};
