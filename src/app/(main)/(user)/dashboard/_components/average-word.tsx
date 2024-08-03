import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLineIcon } from "lucide-react";
import { toast } from "sonner";
import averageWordsPerDocument from "@/lib/actions/dashboard/average-word-per-document";

export default function PublicContents() {
    const [data, setData] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await averageWordsPerDocument();
                if (!response.success) {
                    toast.error(response.message);
                    throw new Error(response.message);
                }
                // Extract the averageWordCount and round to 2 decimal places
                const averageWordCount = response.data ? response.data.averageWordCount : 0;
                setData(Math.round(averageWordCount * 100) / 100);
            } catch (error: any) {
                toast.error(`Error: ${error.message}`);
            }
        };

        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                    Average Words
                </CardTitle>
                <div className='rounded-full p-2 bg-violet-600/30 text-violet-700'>
                    <PencilLineIcon className='h-6 w-6' />
                </div>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{data}</div>
            </CardContent>
        </Card>
    );
}
