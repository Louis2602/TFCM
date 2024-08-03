"use client";

import { Text } from "lucide-react";
import { Heading } from "@/components/global/heading";
// import { useAccounts } from "@/server/brand/query";

const PostsPage = () => {
  // const { data: users } = useAccounts();
  // const totalPosts = users ? users.length : 0;
  const totalPosts = 0;
  return (
    <div>
      <Heading
        title={`Posts (${totalPosts})`}
        description="Manage all posts created by collaborators."
        icon={Text}
      />
      {/* <UsersTable column={column} data={users || []} /> */}
    </div>
  );
};

export default PostsPage;
