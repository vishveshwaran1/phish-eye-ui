
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}) => {
  const changeColor = {
    increase: 'text-green-400',
    decrease: 'text-red-400',
    neutral: 'text-muted-foreground',
  }[changeType];

  return (
    <Card className="glass-card hover:cyber-glow transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <p className={`text-xs ${changeColor} flex items-center gap-1`}>
          {change}
          {description && (
            <span className="text-muted-foreground">from last 24h</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};
