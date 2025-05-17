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
import { Supplier } from './supplier';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SupplierTable({suppliers, offset, totalSuppliers}) {
  let router = useRouter();
  let suppliersPerPage = 5;

  function prevPage() {
    console.log('prevPage');
  }

  function nextPage() {
    console.log('nextPage');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suppliers</CardTitle>
        <CardDescription>
          Manage your suppliers and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Contact Email
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Phone
              </TableHead>
              <TableHead className="hidden md:table-cell">Created Time</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <Supplier
                key={supplier.id}
                supplier={supplier}
                onClick={() => router.push(`/suppliers/${supplier.id}`)}
              />
            ))}
            {suppliers.length === 0 && (
              <TableRow>
                <TableHead colSpan={9} className="text-center">
                  No suppliers found.
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
              {Math.max(0, Math.min(offset - suppliersPerPage, totalSuppliers) + 1)}-{offset}
            </strong>{' '}
            of <strong>{totalSuppliers}</strong> suppliers
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === suppliersPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + suppliersPerPage > totalSuppliers}
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
