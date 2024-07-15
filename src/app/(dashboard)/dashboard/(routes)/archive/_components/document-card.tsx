"use client"
import { Skeleton } from "@/components/ui/skeleton";
import type { Content } from "@/types/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShareButton from "./share-button";
import Link from "next/link";

interface DocumentCardProps {
  data: Content;
}

const DocumentCard = ({ data }: DocumentCardProps) => {
  return (
    <Card className="w-[400px] relative transition-transform transform hover:scale-105 hover:shadow-lg">
      <Link href={`/dashboard/archive/${data.id}`}>
        <CardHeader>
          <CardTitle className="truncate">{data.title}</CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        <ShareButton contentId={data.id} />
        <p className="line-clamp-3 text-sm">{data.body}</p>
      </CardContent>
    </Card>
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
