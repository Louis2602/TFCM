'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

async function getSharedLinks() {
    try {
        const response = await fetch('/api/share/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            } else if (response.status === 404) {
                throw new Error('Content not found');
            } else {
                throw new Error('Error fetching content');
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to delete a specific content item
async function deleteContent(contentId: string) {
    try {
        const response = await fetch(`/api/share/${contentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete content');
        }

        return true;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default function SharedLinksComponent() {
    const [content, setContent] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getSharedLinks();
                setContent(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchContent();
    }, []);

    const handleDelete = async (contentId: string) => {
        try {
            await deleteContent(contentId);
            setContent(content.filter(item => item.id !== contentId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Table>
                <TableCaption>Click on ID to view share page</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className='text-center'>Unshare</TableHead>   
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {content.length !==0 &&
                        content.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}.</TableCell>
                                <TableCell className='text-blue-400'><Link href={`/share/${item.id}`}>{item.id}</Link></TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell className='text-center'>
                                    <button
                                        className='col-span-2'
                                        onClick={() => handleDelete(item.id)}
                                        aria-label={`Delete ${item.title}`}
                                    >
                                        <Trash2 color='red' />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    );
}
