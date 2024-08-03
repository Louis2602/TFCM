import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileIcon } from "lucide-react"
import { toast } from "sonner";
import countTotalContent from "@/lib/actions/dashboard/count-total-content";

export default function TotalContents(){
    const [data, setData] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await countTotalContent();
                if (!response.success || !response.data) {
                    toast.error(response.message);
                    throw new Error(response.message);
                }
                setData(response.data);
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
                    Total Content
                </CardTitle>
                <div className='rounded-full p-2 bg-green-600/30 text-green-700'>
                    <FileIcon className='h-6 w-6' />
                </div>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{data}</div>
            </CardContent>
        </Card>
    )
}