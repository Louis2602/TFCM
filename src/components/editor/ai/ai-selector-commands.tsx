import {
	CommandGroup,
	CommandItem,
	CommandSeparator,
} from '@/components/ui/command';
import { StepForward } from 'lucide-react';
import { useEditor } from 'novel';
import { getPrevText } from 'novel/extensions';
import { Icons } from '@/components/global/icons';

interface Options {
	value: string;
	icon: keyof typeof Icons;
	label: string;
}

const options: Options[] = [
	{
		value: 'improve',
		label: 'Improve writing',
		icon: 'refresh',
	},

	{
		value: 'fix',
		label: 'Fix grammar',
		icon: 'twoCheck',
	},
	{
		value: 'shorter',
		label: 'Make shorter',
		icon: 'arrowWideNarrow',
	},
	{
		value: 'longer',
		label: 'Make longer',
		icon: 'wrapText',
	},
];

interface AISelectorCommandsProps {
	onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
	const { editor } = useEditor();

	return (
		<>
			<CommandGroup heading='Edit or review selection'>
				{options.map((option) => {
					const Icon = Icons[option.icon];
					return (
						<CommandItem
							onSelect={(value) => {
								// const slice = editor?.state.selection.content();
								// const text =
								// 	editor?.storage.markdown.serializer.serialize(
								// 		slice?.content
								// 	);
								const text = editor?.state.doc.textBetween(
									editor.state.selection.from,
									editor.state.selection.to,
									' '
								)!;
								onSelect(text, value);
							}}
							className='flex gap-2 px-4'
							key={option.value}
							value={option.value}
						>
							<Icon className='h-4 w-4 mr-2' />
							{option.label}
						</CommandItem>
					);
				})}
			</CommandGroup>
			<CommandSeparator />
			<CommandGroup heading='Use AI to do more'>
				<CommandItem
					onSelect={() => {
						if (editor) {
							const text = getPrevText(editor, { chars: 5000 });
							onSelect(text, 'continue');
						}
					}}
					value='continue'
					className='gap-2 px-4'
				>
					<StepForward className='h-4 w-4' />
					Continue writing
				</CommandItem>
			</CommandGroup>
		</>
	);
};

export default AISelectorCommands;
