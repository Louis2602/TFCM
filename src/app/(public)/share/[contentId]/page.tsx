"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { remark } from 'remark';
import html from 'remark-html';

export default function SharedPage({ params }) {
    const { contentId } = params;
    const [content, setContent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/data/shared/${contentId}`);
                if (!response.ok) {
                    throw new Error('Content not found');
                }
                const data = await response.json();
                console.log(data.body)

                // Process markdown content to HTML
                const processedContent = await remark()
                    .use(html)
                    .process(data.body);
                const contentHtml = processedContent.toString();

                setContent({ ...data, body: contentHtml });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchContent();
    }, [contentId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!content) {
        return <div>Loading content...</div>;
    }

    return (
        <>
            <div className="h-full w-full">
                <div dangerouslySetInnerHTML={{ __html: content.body }} />
            </div>
        </>
    );
}
