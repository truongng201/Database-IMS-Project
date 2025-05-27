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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SupplierTable({ suppliers, offset, setOffset, totalSuppliers, limit = 10, setError, setShowAlert }) {
  const suppliersPerPage = 5;
  // Always show the correct 5 suppliers from the current chunk
  const paginatedSuppliers = suppliers.slice(offset % limit, (offset % limit) + suppliersPerPage);

  function prevPage(e) {
    e.preventDefault();
    if (offset - suppliersPerPage >= 0) {
      setOffset(offset - suppliersPerPage);
    }
  }

  function nextPage(e) {
    e.preventDefault();
    if (offset + suppliersPerPage < totalSuppliers) {
      setOffset(offset + suppliersPerPage);
    }
  }

  const router = useRouter();

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
              <TableHead className="hidden md:table-cell">Contact Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Total Products</TableHead>
              <TableHead className="hidden md:table-cell">Total Product Quantity</TableHead>
              <TableHead className="hidden md:table-cell">Avg Product Price</TableHead>
              <TableHead className="hidden md:table-cell">Created Time</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSuppliers.map((supplier) => (
              <Supplier
                key={supplier.supplier_id}
                supplier={supplier}
                setError={setError}
                setShowAlert={setShowAlert}
                onClick={() => router.push(`/suppliers/${supplier.supplier_id}`)}
              />
            ))}
            {suppliers.length === 0 && (
              <TableRow>
                <TableHead colSpan={10} className="text-center">
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
              {offset + 1}-{Math.min(offset + suppliersPerPage, totalSuppliers)}
            </strong>{' '}
            of <strong>{totalSuppliers}</strong> suppliers
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
              disabled={offset + suppliersPerPage >= totalSuppliers}
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
