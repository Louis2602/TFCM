"use server";

import { BudgetChart } from "./_components/budget-chart";
import { PostProgressChart } from "./_components/post-progress";
import { CalendarDateRangePicker } from "./_components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getPendingPosts,
  getTotalCost,
  getTotalPosts,
  getTotalUsers,
} from "@/lib/actions/analytics/admin/query";
import { DollarSign, ListTodo, Text, Users } from "lucide-react";

const Dashboard = async () => {
  const totalPosts = await getTotalPosts();
  const totalUsers = await getTotalUsers();
  const totalCost = await getTotalCost();
  const pendingPosts = await getPendingPosts();
  return (
    <ScrollArea>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.data}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Content
              </CardTitle>
              <Text />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts.data}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Content
              </CardTitle>
              <ListTodo />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPosts.data}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Collaborators
              </CardTitle>
              <Users />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.data}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <BudgetChart />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Content Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <PostProgressChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Dashboard;
