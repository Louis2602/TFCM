'use client';

import { useState } from 'react';
import { CalendarDateRangePicker } from '@/components/global/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderDown } from 'lucide-react';
import KeywordInterestChart from './trend-by-keyword';
import { DateRange } from 'react-day-picker';
import { useReactToPrint } from 'react-to-print';
import PrintableContent from './printable-content'; // Updated import

const Overview = () => {
    // Calculate the default date range
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: thirtyDaysAgo,
        to: today,
    });

    const handlePrint = useReactToPrint({
        content: () => document.getElementById('printable-content'),
        documentTitle: 'Analytics Report',
    });

    return (
        <ScrollArea>
            <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-3xl font-bold tracking-tight'>
                        Dashboard
                    </h2>
                    <div className='flex items-center gap-x-2'>
                        <CalendarDateRangePicker
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        />
                        <Button onClick={handlePrint}>
                            <FolderDown className='h-4 w-4 mr-2' />
                            Download
                        </Button>
                    </div>
                </div>
                <div className='space-y-4'>
                    <div id="printable-content">
                        {dateRange && <PrintableContent dateRange={dateRange} />}
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Keyword interest</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <KeywordInterestChart />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>
    );
};

export default Overview;
