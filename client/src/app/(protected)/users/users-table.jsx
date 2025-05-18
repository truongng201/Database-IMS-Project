"use client";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "./user";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UsersTable({
  users,
  totalUsers,
  warehouses,
  setError,
  setShowAlert,
}) {
  const usersPerPage = 5;
  const [offset, setOffset] = useState(0);

  const paginatedUsers = users.slice(offset, offset + usersPerPage);

  function prevPage(e) {
    e.preventDefault();
    setOffset((prev) => Math.max(prev - usersPerPage, 0));
  }

  function nextPage(e) {
    e.preventDefault();
    setOffset((prev) =>
      prev + usersPerPage < totalUsers ? prev + usersPerPage : prev
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your users and their details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Warehouse Name
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <User
                key={user.user_id}
                user={user}
                warehouses={warehouses}
                setError={setError}
                setShowAlert={setShowAlert}
              />
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableHead colSpan={9} className="text-center">
                  No users found.
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {offset + 1}-{Math.min(offset + usersPerPage, totalUsers)}
            </strong>{" "}
            of <strong>{totalUsers}</strong> users
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              type="button"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              type="button"
              disabled={offset + usersPerPage >= totalUsers}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
