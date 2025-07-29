import React from 'react';
import { Card, CardContent } from '@/app/ui/components/card';
import { LucideIcon, User, DollarSign, ShoppingCart } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  user: User,
  'dollar-sign': DollarSign,
  'shopping-cart': ShoppingCart,
};

export function StatsCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  const Icon = icons[icon] || User;
  return (
    <Card>
      <CardContent className="flex items-center space-x-4">
        <Icon className="h-6 w-6 text-primary" />
        <div>
          <p className="text-xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}