'use client';

import { CalendarDateRangePicker } from '@/components/global/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Code, DollarSign, FolderDown, ListTodo } from 'lucide-react';
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ComposedChart,
	Line,
	Legend,
	Bar,
	ResponsiveContainer,
} from 'recharts';

const dataProjectNames = [
	{ x: 100, y: 200, z: 200 },
	{ x: 120, y: 100, z: 260 },
	{ x: 170, y: 300, z: 400 },
	{ x: 140, y: 250, z: 280 },
	{ x: 150, y: 400, z: 500 },
	{ x: 110, y: 280, z: 200 },
];

const dataComposedChart = [
	{
		name: 'Page A',
		uv: 590,
		pv: 800,
		amt: 1400,
	},
	{
		name: 'Page B',
		uv: 868,
		pv: 967,
		amt: 1506,
	},
	{
		name: 'Page C',
		uv: 1397,
		pv: 1098,
		amt: 989,
	},
	{
		name: 'Page D',
		uv: 1480,
		pv: 1200,
		amt: 1228,
	},
	{
		name: 'Page E',
		uv: 1520,
		pv: 1108,
		amt: 1100,
	},
	{
		name: 'Page F',
		uv: 1400,
		pv: 680,
		amt: 1700,
	},
];

const Overview = () => {
	return (
		<ScrollArea>
			<div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>
						Overview
					</h2>
					<div className='flex items-center gap-x-2'>
						<CalendarDateRangePicker />
						<Button>
							<FolderDown className='h-4 w-4 mr-2' />
							Download
						</Button>
					</div>
				</div>
				<div className='space-y-4'>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Total Cost
								</CardTitle>
								<div className='rounded-full p-2 bg-green-600/30 text-green-700'>
									<DollarSign className='h-6 w-6' />
								</div>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>$40.99</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Tasks
								</CardTitle>
								<div className='rounded-full p-2 bg-rose-600/30 text-rose-700'>
									<ListTodo className='h-6 w-6' />
								</div>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>+10</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Code Base
								</CardTitle>
								<div className='rounded-full p-2 bg-violet-600/30 text-violet-700'>
									<Code className='h-6 w-6' />
								</div>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>
									10 files
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
								<CardTitle className='text-sm font-medium'>
									Time Spent
								</CardTitle>
								<div className='rounded-full p-2 bg-yellow-600/30 text-yellow-700'>
									<Clock className='h-6 w-6' />
								</div>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>
									49 minutes
								</div>
							</CardContent>
						</Card>
					</div>
					<div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7'>
						<Card className='col-span-4'>
							<CardHeader>
								<CardTitle>Overview</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={400}>
									<ComposedChart
										width={500}
										height={400}
										data={dataComposedChart}
										margin={{
											top: 20,
											right: 20,
											bottom: 20,
											left: 20,
										}}
									>
										<CartesianGrid stroke='#f5f5f5' />
										<XAxis dataKey='name' scale='band' />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey='uv'
											barSize={20}
											fill='#413ea0'
										/>
										<Line
											type='monotone'
											dataKey='uv'
											stroke='#ff7300'
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
						<Card className='col-span-4 md:col-span-3'>
							<CardHeader>
								<CardTitle>Trending Project Names</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width='100%' height={400}>
									<ScatterChart
										margin={{
											top: 20,
											right: 20,
											bottom: 20,
											left: 20,
										}}
									>
										<CartesianGrid />
										<XAxis
											type='number'
											dataKey='x'
											name='stature'
											unit='cm'
										/>
										<YAxis
											type='number'
											dataKey='y'
											name='weight'
											unit='kg'
										/>
										<Tooltip
											cursor={{ strokeDasharray: '3 3' }}
										/>
										<Scatter
											name='A project name'
											data={dataProjectNames}
											fill='#8884d8'
										/>
									</ScatterChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</ScrollArea>
	);
};

export default Overview;
