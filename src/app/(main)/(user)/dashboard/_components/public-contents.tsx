import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GlobeIcon } from "lucide-react"
import { toast } from "sonner";
import countPublicContent from "@/lib/actions/dashboard/count-public-content";

export default function PublicContents(){
    const [data, setData] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await countPublicContent();
                if (!response.success) {
                    toast.error(response.message);
                    throw new Error(response.message);
                }
                setData(response.data ? response.data : 0);
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
                    Public Content
                </CardTitle>
                <div className='rounded-full p-2 bg-rose-600/30 text-rose-700'>
                    <GlobeIcon className='h-6 w-6' />
                </div>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{data}</div>
            </CardContent>
        </Card>
    )
}