import { Heading } from "@/components/global/heading";
import { getAllUsers } from "@/lib/actions/users/query";
import { UserTable } from "@/components/tables/user/table";
import { columns } from "@/components/tables/user/column";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateUserForm } from "./_components/create-user-form";

const UsersPage = async () => {
  const response = await getAllUsers();
  const users = response.success ? response.data : [];
  const totalUsers = users?.length;

  if (users === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sheet>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-start justify-between">
            <Heading
              title={`Users (${totalUsers})`}
              description="Manage all users, collaborators in your organization."
              icon={User}
            />
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add new collaborator
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create new user account</SheetTitle>
                <SheetDescription>
                  Fill in all the information fields below.
                </SheetDescription>
              </SheetHeader>
              <CreateUserForm />
            </SheetContent>
          </div>
          <UserTable columns={columns} data={users} />
        </div>
      </Sheet>
    </div>
  );
};

export default UsersPage;
