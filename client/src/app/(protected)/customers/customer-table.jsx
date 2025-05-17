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
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomersTable({customers, offset, totalCustomers}) {
  let router = useRouter();
  let customersPerPage = 5;

  function prevPage() {
    console.log('prevPage');
  }

  function nextPage() {
    console.log('nextPage');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          View all customers and their orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Category
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Total sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Supplier</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <Customer
                key={customer.id}
                customer={customer}
                onClick={() => router.push(`/customers/${customer.id}`)}
              />
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableHead colSpan={9} className="text-center">
                  No customers found.
                </TableHead>
              </TableRow>
            )}
            
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(0, Math.min(offset - customersPerPage, totalCustomers) + 1)}-{offset}
            </strong>{' '}
            of <strong>{totalCustomers}</strong> customers
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === customersPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + customersPerPage > totalCustomers}
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
