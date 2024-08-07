import { EditorBubble, useEditor } from 'novel';
import React, { Fragment, useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AISelector } from './ai-selector';
import {} from 'novel/plugins';
import { removeAIHighlight } from 'novel/extensions';
import { Wand2 } from 'lucide-react';

interface AIMenuSwitchProps {
	children: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
const AIMenuSwitch = ({ children, open, onOpenChange }: AIMenuSwitchProps) => {
	const { editor } = useEditor();

	useEffect(() => {
		if (!open) removeAIHighlight(editor!);
	}, [open]);
	return (
		<EditorBubble
			tippyOptions={{
				placement: open ? 'bottom-start' : 'top',
				onHidden: () => {
					onOpenChange(false);
					editor?.chain().unsetHighlight().run();
				},
			}}
			className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
		>
			{open && <AISelector open={open} onOpenChange={onOpenChange} />}
			{!open && (
				<Fragment>
					<Button
						className='gap-1 rounded-none text-purple-500'
						variant='ghost'
						onClick={() => onOpenChange(true)}
						size='sm'
					>
						<Wand2 className='h-4 w-4' />
						Ask AI
					</Button>
					{children}
				</Fragment>
			)}
		</EditorBubble>
	);
};

export default AIMenuSwitch;
