import Link from 'next/link';
import { buttonVariants, Button } from '@/components/ui/button';
import { Icons } from '@/components/global/icons';

export const Pricing = () => {
	return (
		<section className='my-40 md:my-52' id='pricing'>
			<div className='max-w-5xl mx-auto p-[1.25rem] pt-16 flex flex-col items-center'>
				<Button variant='no-hover' size='sm'>
					<span>Pricing</span>
				</Button>
				<h2 className='mt-6 mb-6 font-heading text-4xl md:text-5xl lg:text-6xl tracking-wide text-center'>
					We like keeping things simple
					<br /> Pay once, get credits
				</h2>
				<p className='relative text-primary max-w-2xl text-center text-base md:text-xl mb-12 before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:w-[70%] before:rounded-full before:shadow-hero'>
					For each credit, you can generate up to 200 words.{' '}
					<br className='hidden md:block' />
					No monthly bills, pay as you go.
				</p>
				<div className='relative mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-8 w-full'>
					<div className='border border-border/50 rounded-md px-12 py-6 flex flex-col gap-4 items-center justify-center shadow-primary-card sm:w-1/2 md:w-full'>
						<p className='text-primary font-medium flex items-center justify-center gap-2'>
							<span>30 credits</span>
							<Icons.coins size={20} />
						</p>
						<h2 className='text-4xl font-bold text-center'>Free</h2>
						<span className='text-xs text-foreground'>
							Up to 6k words
						</span>
						<ul className='flex flex-col gap-2 my-4'>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Grammar Checker
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Paraphraser
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Article Writer
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									SEO Wizard
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Text Summarizer
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Save prompts
								</span>
							</li>
						</ul>
						<Link
							href='/dashboard/credits'
							className={buttonVariants({ variant: 'outline' })}
						>
							Get started
						</Link>
					</div>
					<div className='relative border border-border/50 bg-primary/5 rounded-md px-12 py-8 flex flex-col gap-4 items-center justify-center shadow-primary-card sm:w-1/2 md:w-full after:absolute after:left-0 after:top-0 after:h-full after:w-[1px] after:bg-pricing-card-gradient before:absolute before:right-0 before:top-0 before:h-full before:w-[1px] before:bg-pricing-card-gradient'>
						<span className='text-center text-foreground text-sm'>
							Best for starters
						</span>
						<p className='text-primary font-medium flex items-center justify-center gap-2'>
							<span>100 credits</span>
							<Icons.coins size={20} />
						</p>
						<h2 className='text-4xl font-bold text-center'>
							6.99$
						</h2>
						<span className='text-xs text-foreground'>
							Up to 20k words
						</span>
						<ul className='flex flex-col gap-2 my-4'>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Grammar Checker
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Paraphraser
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Article Writer
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									SEO Wizard
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Text Summarizer
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Save prompts
								</span>
							</li>
						</ul>
						<Link
							href='/dashboard/credits'
							className={buttonVariants()}
						>
							Buy now
						</Link>
					</div>
					<div className='border border-border/50 rounded-md px-12 py-6 flex flex-col gap-4 items-center justify-center shadow-primary-card sm:w-1/2 md:w-full'>
						<p className='text-primary font-medium flex items-center justify-center gap-2'>
							<span>200 credits</span>
							<Icons.coins size={20} />
						</p>
						<h2 className='text-4xl font-bold text-center'>
							11.99$
						</h2>
						<span className='text-xs text-foreground'>
							Up to 40k words
						</span>
						<ul className='flex flex-col gap-2 my-4'>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Grammar Checker
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Paraphraser
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Article Writer
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									SEO Wizard
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Text Summarizer
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Icons.check
									size={16}
									className='text-foreground'
								/>
								<span className='text-foreground'>
									Save prompts
								</span>
							</li>
						</ul>
						<Link
							href='/dashboard/credits'
							className={buttonVariants({ variant: 'outline' })}
						>
							Buy now
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};
