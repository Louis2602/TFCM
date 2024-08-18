'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import getTrendByKeyword from '@/lib/actions/dashboard/get-trend-by-keyword';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChartData {
    date: string;
    [key: string]: number | string;
}

export default function KeywordInterestChart() {
    const defaultKeywords = '';
    const [query, setQuery] = useState<string>(defaultKeywords);
    const [searchQuery, setSearchQuery] = useState<string>(defaultKeywords); // New state for search query
    const [data, setData] = useState<ChartData[]>([]);
    const [queries, setQueries] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [lineColors, setLineColors] = useState<string[]>([]);

    // Fetch data when searchQuery changes
    useEffect(() => {
        const fetchData = async () => {
            if (!searchQuery.trim()) return; // Do not fetch if searchQuery is empty

            setLoading(true);
            setData([]); // Clear previous data

            try {
                // Parse the query string into an array of individual queries
                const parsedQueries = searchQuery.split(',').map(q => q.trim());
                setQueries(parsedQueries);

                // Fetch data from the server-side function
                const result = await getTrendByKeyword(searchQuery);

                if (!result || result.length === 0) {
                    toast.error('No data available for the given keywords.');
                    setData([]); // Clear data
                } else {
                    setData(result);
                    // Generate colors after data is fetched
                    const colors = parsedQueries.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
                    setLineColors(colors);
                }
            } catch (error) {
                toast.error('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    // Function to handle the search input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    // Function to handle form submission
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Set the search query to trigger data fetch
        setSearchQuery(query);
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-4 flex items-center">
                <Input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Enter keywords (e.g., Coffee, Captain America)"
                    className="border p-2"
                />
                <Button type="submit" className="ml-2">Search</Button>
            </form>

            {/* Display the chart */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    width={500}
                    height={300}
                    data={data.length > 0 ? data : [{ date: 'No data', ...Object.fromEntries(queries.map(q => [q, 0])) }]}
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
                    {queries.map((query, index) => (
                        <Line
                            key={query}
                            type="monotone"
                            dataKey={query}
                            stroke={lineColors[index] || '#000000'}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
