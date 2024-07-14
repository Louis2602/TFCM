import { Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Content } from "@/types/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface DocumentCardProps {
  data: Content;
}

const DocumentCard = ({ data }: DocumentCardProps) => {
  return (
    <Link href={`/dashboard/archive/${data.id}`}>
      <Card className="w-[400px] relative transition-transform transform hover:scale-105 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="truncate">{data.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="absolute top-2 right-2 text-primary p-2 rounded-full focus:outline-none cursor-pointer hover:text-primary/75 transition-colors">
            <Share2 className="h-5 w-5" />
          </div>
          <p className="line-clamp-3 text-sm">{data.body}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DocumentCard;

DocumentCard.Skeleton = function DocumentCardSkeleton() {
  return (
    <div className="aspect-[600/400] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
