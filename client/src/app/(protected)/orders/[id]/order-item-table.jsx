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
import { OrderItem } from './order-item';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function OrderItemTable({ items, offset, setOffset, totalItems, limit = 5, order }) {
  // Pagination logic
  function prevPage(e) {
    e.preventDefault();
    if (offset - limit >= 0) setOffset(offset - limit);
  }
  function nextPage(e) {
    e.preventDefault();
    if (offset + limit < totalItems) setOffset(offset + limit);
  }

  // Status colors matching the order component
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  // Format order ID as O0001
  const formatOrderId = (id) => `O${String(id).padStart(4, '0')}`;

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString || "N/A";
    }
  };

  // Format currency - handle string values from API
  const formatCurrencyValue = (value) => {
    if (value === undefined || value === null) return "N/A";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return formatCurrency(numValue);
  };

  // Parse numeric values that come as strings
  const parseNumericValue = (value) => {
    if (value === undefined || value === null) return 0;
    const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
        <CardDescription>
          {order && (
            <>
              <div className="flex flex-wrap gap-6 items-center bg-muted/60 rounded-md p-4 mb-4 border border-muted-foreground/10">
                <span>
                  <span className="font-semibold text-muted-foreground">Order ID:</span> {formatOrderId(order.order_id)}
                </span>
                <span>
                  <span className="font-semibold text-muted-foreground">Customer:</span> {order.customer_name}
                </span>
                <span>
                  <span className="font-semibold text-muted-foreground">Email:</span> {order.customer_email}
                </span>
                <span>
                  <span className="font-semibold text-muted-foreground">Order Date:</span> {formatDate(order.order_date)}
                </span>
                <span>
                  <span className="font-semibold text-muted-foreground">Status:</span> 
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${statusColors[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.order_status || "unknown"}
                  </span>
                </span>
                <span>
                  <span className="font-semibold text-muted-foreground">Total Value:</span> {formatCurrencyValue(order.total_price)}
                </span>
                <span>
                  <span className="font-semibold text-muted-foreground">Total Items:</span> {parseNumericValue(order.total_items)}
                </span>
              </div>
            </>
          )}
          All items in this order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <OrderItem key={`${item.product_id}-${index}`} item={item} />
            ))}
            {items.length === 0 && (
              <TableRow>
                <td colSpan={7} className="text-center">No items found in this order.</td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{totalItems > 0 ? offset + 1 : 0}-{Math.min(offset + limit, totalItems)}</strong> of <strong>{totalItems}</strong> items
          </div>
          <div className="flex">
            <Button onClick={prevPage} variant="ghost" size="sm" type="button" disabled={offset === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Prev
            </Button>
            <Button onClick={nextPage} variant="ghost" size="sm" type="button" disabled={offset + limit >= totalItems}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
