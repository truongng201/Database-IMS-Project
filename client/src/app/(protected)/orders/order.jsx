'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';

export function Order({ order, onClick }) {
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
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell className="font-medium">
        {formatOrderId(order.order_id)}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{order.customer_name || "N/A"}</span>
          <span className="text-sm text-muted-foreground">{order.customer_email || "N/A"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
          {order.order_status || "unknown"}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(order.order_date)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatCurrencyValue(order.total_order_value)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-col">
          <span>{parseNumericValue(order.total_items)} items</span>
          <span className="text-sm text-muted-foreground">
            {parseNumericValue(order.unique_products_ordered)} unique
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm">
          {order.warehouse_name || "N/A"}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
            <DropdownMenuItem>Cancel order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
} 