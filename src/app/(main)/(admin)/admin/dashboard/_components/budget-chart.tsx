"use client";

import { getMonthlyBudget } from "@/lib/actions/analytics/admin/budget";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function BudgetChart() {
  const [data, setData] = useState<any[] | undefined>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const result = await getMonthlyBudget();
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
      <BarChart data={data}>
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
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#1c1c1c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
