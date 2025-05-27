'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Customer } from './customer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomersTable({ customers, offset, setOffset, totalCustomers, limit = 10, setError, setShowAlert }) {
  function prevPage(e) {
    e.preventDefault();
    if (offset - limit >= 0) setOffset(offset - limit);
  }
  function nextPage(e) {
    e.preventDefault();
    if (offset + limit < totalCustomers) setOffset(offset + limit);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Manage your customers and their details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Purchase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <Customer key={customer.customer_id || customer.id} customer={customer} setError={setError} setShowAlert={setShowAlert} />
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableHead colSpan={8} className="text-center">No customers found.</TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{offset + 1}-{Math.min(offset + limit, totalCustomers)}</strong> of <strong>{totalCustomers}</strong> customers
          </div>
          <div className="flex">
            <Button onClick={prevPage} variant="ghost" size="sm" type="button" disabled={offset === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Prev
            </Button>
            <Button onClick={nextPage} variant="ghost" size="sm" type="button" disabled={offset + limit >= totalCustomers}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
