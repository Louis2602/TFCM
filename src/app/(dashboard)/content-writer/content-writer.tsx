'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCompletion } from 'ai/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { contentWriterFormSchema } from '@/lib/validations/content-writer';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/global/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { OutputBox } from './_components/output-box';
import useAppStore from '@/lib/store';

type FormData = z.infer<typeof contentWriterFormSchema>;

const outlinePlaceholders = {
	0: 'eg. What is Next.JS',
	1: 'eg. What are the benefits of Next.JS',
};

type Outline = FormData['outline'];

const getOutlinesWithValue = (outlines: Outline): string[] => {
	if (outlines) {
		return outlines
			.map((outline) => outline.value || '')
			.filter((outline) => outline);
	} else {
		return [];
	}
};

export const ContentWriter = () => {
	const { setMarkdown } = useAppStore();
	const [price, setPrice] = useState(0);

	const router = useRouter();

	const { complete, completion, isLoading } = useCompletion({
		api: `/api/generate/content`,
		onResponse: (response: Response) => {
			if (response.status === 429) {
				toast({
					title: 'You have reached your request limit for the day.',
				});
				return;
			}
		},
		onError: (error) => {
			toast({
				title: 'Something went wrong',
				description: error.message,
			});
		},
		onFinish() {
			toast({
				title: 'Generating done',
				description: 'Your content has been generated successfully',
			});
			router.refresh();
		},
	});

	const prevRef = useRef('');

	useEffect(() => {
		const diff = completion.slice(prevRef.current.length);
		prevRef.current = completion;
		setMarkdown((prev) => prev + diff);
	}, [completion, setMarkdown]);

	const form = useForm<FormData>({
		resolver: zodResolver(contentWriterFormSchema),
		defaultValues: {
			keywords: '',
			title: '',
			outline: [
				{
					value: '',
				},
				{
					value: '',
				},
			],
			tone: 'Standard',
		},
	});

	const { fields, append } = useFieldArray({
		name: 'outline',
		control: form.control,
	});

	const outlines = getOutlinesWithValue(form.getValues('outline'));

	useEffect(() => {
		setPrice(outlines.length);
	}, [outlines]);

	const onSubmit = async (formData: FormData) => {
		setMarkdown('');

		const outlines = getOutlinesWithValue(formData.outline);

		const prompts = [
			`You are writing the article with the title of "${formData.title}" and the SEO keywords "${formData.keywords}", in a ${formData.tone} writing tone. Write intro for this article and then follow the upcoming prompts.`,
			...outlines,
		];

		for (let i = 0; i < prompts.length; i++) {
			await complete(prompts[i]);
		}
	};

	return (
		<div className='h-full flex flex-col md:flex-row gap-6'>
			<div className='w-full h-full flex flex-col'>
				<div className='flex flex-col'>
					<div className='mb-4 pb-4 border-b border-border/50'>
						<h2 className='font-heading text-3xl'>
							Content Writer
						</h2>
						<p className='text-muted-foreground'>
							Generate cutting-edge content in less than a minute.
						</p>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<FormField
								control={form.control}
								name='keywords'
								render={({ field }) => (
									<FormItem>
										<FormLabel>SEO keywords</FormLabel>
										<FormControl>
											<Input
												placeholder='Example: nextjs tutorial'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Content Title</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='text'
												placeholder='Example: How to create NextJS app'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div>
								{fields.map((field, index) => (
									<FormField
										control={form.control}
										key={field.id}
										name={`outline.${index}.value`}
										render={({ field }) => (
											<FormItem>
												<FormLabel
													className={cn(
														index !== 0 && 'sr-only'
													)}
												>
													Content Outline
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={
															outlinePlaceholders[
																index as keyof typeof outlinePlaceholders
															]
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='mt-2'
									onClick={() => append({ value: '' })}
								>
									Add outline
								</Button>
							</div>
							<FormField
								control={form.control}
								name='tone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tone</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select an content writing tone' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Standard'>
													Standard
												</SelectItem>
												<SelectItem value='Creative'>
													Creative
												</SelectItem>
												<SelectItem value='Simple'>
													Simple
												</SelectItem>
												<SelectItem value='Formal'>
													Formal
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<p className='text-sm flex items-center gap-1'>
								<span>Price: {price + 1}</span>
								<Icons.coins size={12} />
							</p>
							<Button className='mt-4 w-fit' disabled={isLoading}>
								{isLoading && (
									<Icons.spinner
										className='mr-2 h-4 w-4 animate-spin'
										aria-hidden='true'
									/>
								)}
								Generate
								<span className='sr-only'>Generate</span>
							</Button>
						</form>
					</Form>
				</div>
			</div>
			<OutputBox />
		</div>
	);
};
