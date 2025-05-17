"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from './users-table';
import withAuth from '@/hooks/withAuth';

function UsersPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Inactive</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <UsersTable
          users={[]}
          offset={0}
          totalUsers={0}
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(UsersPage);
