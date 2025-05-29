'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
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
import { Order } from './order';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OrdersTable({ orders, offset, setOffset, totalOrders, limit = 5, setError, setShowAlert, onStatusUpdate }) {
  let router = useRouter();

  function prevPage(e) {
    e.preventDefault();
    if (offset - limit >= 0) setOffset(offset - limit);
  }

  function nextPage(e) {
    e.preventDefault();
    if (offset + limit < totalOrders) setOffset(offset + limit);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          Manage your orders and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead className="hidden md:table-cell">Warehouse</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <Order
                key={order.order_id}
                order={order}
                setError={setError}
                setShowAlert={setShowAlert}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {totalOrders === 0 ? 0 : Math.min(offset + 1, totalOrders)}-{Math.min(offset + limit, totalOrders)}
            </strong>{' '}
            of <strong>{totalOrders}</strong> orders
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={offset + limit >= totalOrders}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 