import { getContentById } from "@/lib/actions/content/query";
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MarkdownRenderer } from "@/components/global/markdown";
import { getFile } from "@/lib/actions/media/file/read";

interface ContentIdPageProps {
  params: {
    contentId: string;
  };
}
export default async function ContentIdPage({
  params: { contentId },
}: ContentIdPageProps) {
  const { file } = await getFile(contentId);

  if (file === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <ContentBreadcrumb title={file.name} />
      </div>
        {file.type.includes("image") && <img src={file.url} alt={file.name} width={800}/>}
        {file.type.includes("video") && <video src={file.url} />}        
    </div>
  );
}

const ContentBreadcrumb = ({ title }: { title: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/media">Media Management</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
