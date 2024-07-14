import { getContentById } from "@/lib/actions/content/query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MarkdownRenderer } from "@/components/global/markdown";

interface ContentIdPageProps {
  params: {
    contentId: string;
  };
}
export default async function ContentIdPage({
  params: { contentId },
}: ContentIdPageProps) {
  const { data: content } = await getContentById(contentId);

  if (content === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <ContentBreadcrumb title={content.title} />
      </div>
      {content.body.split("\\n").map((str: string, idx: number) => (
        <MarkdownRenderer key={idx}>{str + "<br/>"}</MarkdownRenderer>
      ))}
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
          <BreadcrumbLink href="/dashboard/archive">Archive</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
