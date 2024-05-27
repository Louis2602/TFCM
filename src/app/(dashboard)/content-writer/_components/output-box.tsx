'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import removeMarkdown from 'markdown-to-text';
import { Icons } from '@/components/global/icons';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/global/hint';
import { MarkdownRenderer } from '@/components/global/markdown';
import useAppStore from '@/lib/store';

export const OutputBox = () => {
	const [setShowContent, content, setMarkdown] = useAppStore((state) => [
		state.setShowContent,
		state.content,
		state.setMarkdown,
	]);
	const pathname = usePathname();
	useEffect(() => {
		setMarkdown('');
	}, [pathname, setMarkdown]);

	const handleCopyText = () => {
		const cleanText = removeMarkdown(content.markdown);
		navigator.clipboard.writeText(cleanText);
	};

	const handleFullscreen = () => {
		if (!content.markdown) return null;
		setShowContent(true);
	};

	return (
		<div className='border border-border/50 rounded-lg w-full max-md:min-h-[30rem] max-h-[52rem] flex flex-col overflow-hidden'>
			<div className='h-full px-3 py-2 text-sm overflow-auto'>
				<MarkdownRenderer>{content.markdown}</MarkdownRenderer>
			</div>

			<div className='py-2 px-4 flex items-center justify-between bg-border/50'>
				<div className='text-sm'>
					<Hint label='Fullscreen'>
						<Icons.maximize
							onClick={handleFullscreen}
							size={18}
							className='cursor-pointer'
						/>
					</Hint>
				</div>
				<Button onClick={handleCopyText}>Copy text</Button>
			</div>
		</div>
	);
};
