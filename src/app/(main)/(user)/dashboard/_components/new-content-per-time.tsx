'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import countContentPerTime from '@/lib/actions/dashboard/content-per-time';
import { toast } from 'sonner';

interface ChartData {
    date: string;
    postCount: number;
}

interface NewContentPerTimeChartProps {
    startDate: Date;
    endDate: Date;
}

export default function NewContentPerTimeChart({ startDate, endDate }: NewContentPerTimeChartProps) {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await countContentPerTime(startDate, endDate);
                if (!response.success || !response.data) {
                    toast.error(response.message);
                    throw new Error(response.message);
                }
                setData(response.data as ChartData[]);
            } catch (error: any) {
                toast.error(`Error: ${error.message}`);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="postCount"
                    name="Content per time"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
