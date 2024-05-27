'use client';

import { Icons } from '@/components/global/icons';
import { spinner } from '@/components/global/spinner';

export function SpinnerMessage() {
	return (
		<div className='group relative flex items-start md:-ml-12'>
			<div className='flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm'>
				<Icons.openai />
			</div>
			<div className='ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1'>
				{spinner}
			</div>
		</div>
	);
}
