'use server';
import axios from 'axios';
import { env } from '@/env';

// Define types for the data
interface TimelineData {
    date: string;
    values: {
        query: string;
        value: string;
        extracted_value: number;
    }[];
}

interface ChartData {
    date: string;
    [key: string]: number | string;
}

export default async function getTrendByKeyword(query: string): Promise<ChartData[]> {
    if (!query.trim()) {
        return []; 
    }

    try {
        // Parse the query string into an array of individual queries
        console.log(query);
        const parsedQueries = query.split(',').map(q => q.trim());
        const formattedQuery = parsedQueries.join('%2C+');
        const url = `${env.GOOGLE_TRENDS_REALTIME_URL}?engine=google_trends&q=${formattedQuery}&api_key=${env.GOOGLE_TRENDS_API_KEY}`;
        console.log(url);

        // Fetch the data from the API
        const response = await axios.get(url);
        const timelineData: TimelineData[] = response.data.interest_over_time.timeline_data;

        // Process the timeline data
        const formattedData: ChartData[] = timelineData.map(item => {
            const entry: ChartData = { date: item.date };
            parsedQueries.forEach(query => {
                entry[query] = item.values.find(v => v.query === query)?.extracted_value || 0;
            });
            return entry;
        });

        return formattedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data');
    }
}
