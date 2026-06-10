"use client";

import { useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { format, subDays, isAfter, startOfDay } from "date-fns";
import {ar} from "date-fns/locale/ar";

interface DashboardChartProps {
  orders: { createdAt: Date }[];
}

export default function DashboardChart({ orders }: DashboardChartProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month"|"day"|"year">("day");

  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const daysToSubtract = timeframe === "day" ? 1 : timeframe ==="week"? 7 : timeframe==="month"?30:365;
    const startDate = subDays(today, daysToSubtract);

    // Filter orders within the selected timeframe
    const filteredOrders = orders.filter(o => isAfter(new Date(o.createdAt), startDate));

    // Group by date
    const grouped = filteredOrders.reduce((acc, order) => {
      const dateStr = format(new Date(order.createdAt), "dd MMM", { locale: ar });
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create an array of the last X days to ensure zero-order days show up
    const finalData = [];
    for (let i = daysToSubtract - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "dd MMM", { locale: ar });
      finalData.push({
        date: dateStr,
        طلبات: grouped[dateStr] || 0,
      });
    }

    return finalData;
  }, [orders, timeframe]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border
     border-slate-100">
      <div className="flex  justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">تحليل المبيعات</h3>
        <div className="lg:flex mad:flex grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
            onClick={() => setTimeframe("day")}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
              timeframe === "day" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            يوم
          </button>
          <button 
            onClick={() => setTimeframe("week")}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
              timeframe === "week" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            أسبوع
          </button>
          <button 
            onClick={() => setTimeframe("month")}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
              timeframe === "month" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            شهر
          </button>
            <button 
            onClick={() => setTimeframe("year")}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
              timeframe === "year" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            سنة
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="طلبات" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={timeframe === 'week' ? 40 : 12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}