export function useDashboardData() {
  const stats = [
    { title: 'Users', value: '1,234', icon: 'user' },
    { title: 'Sales', value: '$12,345', icon: 'dollar-sign' },
    { title: 'Orders', value: '345', icon: 'shopping-cart' },
  ];

  const chartData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 55 },
    { month: 'Mar', value: 70 },
    { month: 'Apr', value: 60 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 90 },
  ];

  const chartData2 = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 50 },
    { month: 'Apr', value: 65 },
    { month: 'May', value: 80 },
    { month: 'Jun', value: 95 },
  ];

  const barChartData = [
    { category: 'Electronics', value: 120 },
    { category: 'Apparel', value: 98 },
    { category: 'Accessories', value: 150 },
    { category: 'Home Goods', value: 80 },
    { category: 'Books', value: 60 },
  ];

  const tableData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Product ${String.fromCharCode(65 + (i % 26))}`,
    amount: `$${(Math.random() * 200 + 50).toFixed(2)}`,
    status: ['Completed', 'Pending', 'Failed'][i % 3],
  }));

  return { stats, chartData, chartData2, barChartData, tableData };
}