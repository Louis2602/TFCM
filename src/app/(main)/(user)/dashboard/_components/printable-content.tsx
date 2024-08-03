import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewContentPerTimeChart from './new-content-per-time';
import PublicContents from './public-contents';
import TotalContents from './total-contents';
import AverageWordsPerDocument from './average-word';
import { DateRange } from 'react-day-picker';

interface PrintableContentProps {
    dateRange: DateRange;
}

const PrintableContent = forwardRef<HTMLDivElement, PrintableContentProps>(({ dateRange }, ref) => (
    <div ref={ref} className="printable-content">
        <div className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <TotalContents />
                <PublicContents />
                <AverageWordsPerDocument />
            </div>
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NewContentPerTimeChart
                            startDate={dateRange.from ?? new Date()}
                            endDate={dateRange.to ?? new Date()}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
));

PrintableContent.displayName = 'PrintableContent';

export default PrintableContent;
