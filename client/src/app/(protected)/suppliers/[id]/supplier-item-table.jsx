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
import { SupplierItem } from './supplier-item';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SupplierTable({ products, offset, setOffset, totalProducts, limit = 5, supplier }) {
  // Pagination logic
  function prevPage(e) {
    e.preventDefault();
    if (offset - limit >= 0) setOffset(offset - limit);
  }
  function nextPage(e) {
    e.preventDefault();
    if (offset + limit < totalProducts) setOffset(offset + limit);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products of Supplier</CardTitle>
        <CardDescription>
          {supplier && (
            <div className="flex flex-wrap gap-6 items-center bg-muted/60 rounded-md p-4 mb-4 border border-muted-foreground/10">
              <div>
                <span className="font-semibold text-muted-foreground">Supplier ID:</span> {supplier.supplier_id}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Name:</span> {supplier.supplier_name}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Contact Name:</span> {supplier.contact_name}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Contact Email:</span> {supplier.contact_email}
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Phone:</span> {supplier.phone}
              </div>
            </div>
          )}
          All products provided by this supplier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created Time</TableHead>
              <TableHead>Updated Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <SupplierItem key={product.product_id} product={product} />
            ))}
            {products.length === 0 && (
              <TableRow>
                <td colSpan={8} className="text-center">No products found.</td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{offset + 1}-{Math.min(offset + limit, totalProducts)}</strong> of <strong>{totalProducts}</strong> products
          </div>
          <div className="flex">
            <Button onClick={prevPage} variant="ghost" size="sm" type="button" disabled={offset === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Prev
            </Button>
            <Button onClick={nextPage} variant="ghost" size="sm" type="button" disabled={offset + limit >= totalProducts}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
