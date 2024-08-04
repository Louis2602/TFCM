import { Heading } from "@/components/global/heading";
import { Text } from "lucide-react";
import { PostTable } from "@/components/tables/post/table";
import { getAllContent } from "@/lib/actions/content/query";
import { columns } from "@/components/tables/post/column";

const PostsPage = async () => {
  const response = await getAllContent();
  const posts = response.success ? response.data : [];
  const totalUsers = posts?.length;

  if (posts === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Heading
        title={`Posts (${totalUsers})`}
        description="Manage all posts created by collaborators."
        icon={Text}
      />
      <PostTable columns={columns} data={posts} />
    </div>
  );
};

export default PostsPage;
