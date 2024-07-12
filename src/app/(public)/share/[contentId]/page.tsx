"use client";
import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import Unauthorized from './_components/unauthorized';
import Error from './_components/error';
import styles from './styles/shared-page.module.css'

export default function SharedContent({ params }: any) {
    const router = useRouter();
    const { contentId } = params;
    const [content, setContent] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/share/${contentId}`);
                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Unauthorized'); // Change to set an appropriate error message
                    } else if (response.status === 404) {
                        setError('Not Found');
                    } else {
                        setError('Error fetching content');
                    }
                    return;
                }
                const data = await response.json();
                console.log(data);

                // Process markdown content to HTML
                const processedContent = await remark()
                    .use(html)
                    .process(data.body);
                const contentHtml = processedContent.toString();

                setContent({ ...data, body: contentHtml });
            } catch (err: any) {
                setError('Error fetching content');
            }
        };

        fetchContent();
    }, [contentId]);

    if (error === 'Unauthorized') {
        return <Unauthorized />;
    }

    if (error === 'Not Found') {
        notFound();
        return null;
    }

    if (error) {
        return <Error />;
    }

    if (!content) {
        return(
            <>
                <div className='flex h-screen w-screen justify-center items-center'>
                    <div>Loading...</div>
                </div>
            </>
        );
    }

    return (
        <div className="h-screen w-screen flex justify-center p-5 pt-28">
            <div className={`max-w-[768px] ${styles.content}`} dangerouslySetInnerHTML={{ __html: content.body }} />
        </div>
    );
}