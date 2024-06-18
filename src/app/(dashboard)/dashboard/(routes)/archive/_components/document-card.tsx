import { Share, Share2 } from 'lucide-react';

interface DocumentCardProps {
	data: {
		title: string;
		seoKeywords: string;
		outlines: string;
	};
}

const DocumentCard = ({ data }: DocumentCardProps) => {
	return (
		<div className='relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
			<div className='absolute top-2 right-2 text-primary p-2 rounded-full focus:outline-none cursor-pointer hover:text-primary/75 transition-colors'>
				<Share2 className='h-5 w-5' />
			</div>
			<h2 className='text-2xl font-semibold mb-2'>{data.title}</h2>
			<p className='text-sm text-gray-500 mb-4'>
				<span className='font-bold'>SEO Keywords:</span>{' '}
				{data.seoKeywords}
			</p>
			<p>{data.outlines}</p>
		</div>
	);
};

export default DocumentCard;
