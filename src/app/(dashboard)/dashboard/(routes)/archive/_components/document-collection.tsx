import DocumentCard from './document-card';

const documents = [
	{
		title: 'Document 1',
		seoKeywords: 'keyword1, keyword2, keyword3',
		outlines: 'Outline for Document 1',
	},
	{
		title: 'Document 2',
		seoKeywords: 'keywordA, keywordB, keywordC',
		outlines: 'Outline for Document 2',
	},
	// Add more document objects as needed
];

export async function DocumentCollection() {
	return (
		<div>
			<h1 className='text-3xl font-bold mb-6'>All Written Contents</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{documents.map((doc, index) => (
					<DocumentCard key={index} data={doc} />
				))}
			</div>
		</div>
	);
}
