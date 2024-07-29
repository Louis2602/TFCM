'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

export function CalendarDateRangePicker({
    className,
    dateRange,
    setDateRange
}: React.HTMLAttributes<HTMLDivElement> & {
    dateRange: DateRange | undefined,
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id='date'
                        variant={'outline'}
                        className={cn(
                            'w-[260px] justify-start text-left font-normal',
                            !dateRange && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                                    {format(dateRange.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(dateRange.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='end'>
                    <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
