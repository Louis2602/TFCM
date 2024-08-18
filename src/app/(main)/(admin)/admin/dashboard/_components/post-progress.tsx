"use client";

import { getMonthlyPostProgress } from "@/lib/actions/analytics/admin/post-progress";
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function PostProgressChart() {
  const [data, setData] = useState<any[] | undefined>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const result = await getMonthlyPostProgress();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result?.message);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div>Failed to get budget data: {error}</div>;
  }
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
          dataKey="total"
          stroke="#1c1c1c"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
