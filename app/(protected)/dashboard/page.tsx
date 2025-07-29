'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui/components/card';
import { useDashboardData } from './useDashboardData';
import { StatsCard } from '@/app/ui/dashboard/StatsCard';
import { ChartCard } from '@/app/ui/dashboard/ChartCard';
import { BarChartCard } from '@/app/ui/dashboard/BarChartCard';
import { TableCard } from '@/app/ui/dashboard/TableCard';

export default function DashboardPage() {
  const { stats, chartData, chartData2, barChartData, tableData } = useDashboardData();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {stats.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartCard data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartCard data={chartData2} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartCard data={barChartData} />
          </CardContent>
        </Card>

        {/* Placeholder for future chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartCard data={chartData} />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <TableCard data={tableData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}