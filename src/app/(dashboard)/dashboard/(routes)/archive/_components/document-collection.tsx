import { getUserDocuments } from "@/lib/actions/content/query";
import DocumentCard from "./document-card";
import { Empty } from "@/components/global/empty";

export async function DocumentCollection() {
  const { data: documents, success, message } = await getUserDocuments();

  if (!success) {
    return (
      <div>
        <div className="mb-8 pb-4 border-b border-border/50">
          <h2 className="font-heading text-3xl">All written contents</h2>
          <p className="text-muted-foreground">Manage your content creation.</p>
        </div>
        <p className="text-red-500">{message}</p>
      </div>
    );
  }

  if (documents === undefined) {
    return (
      <div>
        <div className="mb-8 pb-4 border-b border-border/50">
          <h2 className="font-heading text-3xl">All written contents</h2>
          <p className="text-muted-foreground">Manage your content creation.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <DocumentCard.Skeleton />
          <DocumentCard.Skeleton />
          <DocumentCard.Skeleton />
          <DocumentCard.Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 pb-4 border-b border-border/50">
        <h2 className="font-heading text-3xl">All written contents</h2>
        <p className="text-muted-foreground">Manage your content creation.</p>
      </div>
      {documents.length === 0 ? (
        <Empty label="No contents found" src="/note.svg" />
      ) : (
        <div className="flex flex-wrap gap-4">
          {documents.map((doc, index) => (
            <DocumentCard key={index} data={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
