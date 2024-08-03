"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Jan",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Feb",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Mar",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Apr",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "May",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Jun",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Jul",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Aug",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Sep",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Oct",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Nov",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
  {
    name: "Dec",
    promotions: Math.floor(Math.random() * 500) + 100,
  },
];

export function PromotionStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="promotions"
          stroke="#1c1c1c"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
