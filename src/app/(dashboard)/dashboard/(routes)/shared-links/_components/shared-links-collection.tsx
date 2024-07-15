'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getAllSharedContents } from '@/lib/actions/content/share';
import UnshareButton from './unshare-button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function SharedLinksCollection() {
    const [contents, setContents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContents() {
            try {
                const response = await getAllSharedContents();
                if (!response.success) {
                    setError(response.message);
                } else if (response.data) {
                    setContents(response.data);
                }
            } catch (error) {
                setError('Error fetching contents');
            }
        }

        fetchContents();
    }, []);

    const handleDelete = async (contentId: string) => {
        try {
            setContents((prevContents) => prevContents.filter((item) => item.id !== contentId));
        } catch (error) {
            setError('Error deleting content');
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
                        <TableHead className="text-center">Unshare</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contents.length !== 0 &&
                        contents.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}.</TableCell>
                                <TableCell className="text-blue-400">
                                    <Link href={`/share/${item.id}`}>{item.id}</Link>
                                </TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell className="flex justify-center">
                                    <UnshareButton  contentId={item.id} onDelete={handleDelete}/>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </>
    );
}
