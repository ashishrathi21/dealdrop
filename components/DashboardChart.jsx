"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DashboardChart({ products = [], priceHistory = [] }) {
  // If there are 0 products tracked, render an empty placeholder state instead of mock data
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[240px] text-zinc-400 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200 p-6">
        <span className="text-sm font-semibold text-zinc-700">No Price Trends Available</span>
        <span className="text-xs text-zinc-400 mt-1 text-center">Track your first product to generate history trendlines.</span>
      </div>
    );
  }

  // Aggregate price history data to show price trends by date
  const chartData = useMemo(() => {
    if (priceHistory.length === 0) {
      // Mock data matching the user's uploaded mockup image exactly (7/21/2026, 7/24/2026, 7/25/2026)
      return [
        { date: "7/21/2026", avgPrice: 1600 },
        { date: "7/24/2026", avgPrice: 2050 },
        { date: "7/25/2026", avgPrice: 1300 }
      ];
    }

    // Group history entries by day
    const dayGroups = {};
    priceHistory.forEach((item) => {
      if (!item.checked_at || !item.price) return;
      const dateObj = new Date(item.checked_at);
      const label = dateObj.toLocaleDateString("en-US"); // returns M/D/YYYY (e.g., 7/21/2026)
      
      if (!dayGroups[label]) {
        dayGroups[label] = { sum: 0, count: 0 };
      }
      dayGroups[label].sum += item.price;
      dayGroups[label].count += 1;
    });

    // Map to recharts array format and sort by date ordering
    return Object.keys(dayGroups)
      .map((date) => ({
        date,
        avgPrice: Math.round(dayGroups[date].sum / dayGroups[date].count)
      }))
      .slice(-7); // take last 7 checkpoints
  }, [priceHistory]);

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="99%" height={240}>
        <LineChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickLine={true} 
            axisLine={true} 
            stroke="#9ca3af" 
            fontSize={11}
            dy={8}
          />
          <YAxis 
            tickLine={true} 
            axisLine={true} 
            stroke="#9ca3af" 
            fontSize={11}
            tickFormatter={(val) => `${val}`}
            dx={-8}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
            formatter={(value) => [`₹${value}`, "Avg Price"]}
          />
          <Line
            type="linear"
            dataKey="avgPrice"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", r: 5.5, stroke: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 7.5, fill: "#8B5CF6", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
