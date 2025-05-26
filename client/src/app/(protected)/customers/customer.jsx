import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';

export function Customer({ customer, onClick }) {
  // Format date safely with fallback
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch (error) {
      return dateString || "N/A";
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell>{customer.id}</TableCell>
      <TableCell className="font-medium">{customer.name || "N/A"}</TableCell>
      <TableCell>{customer.email || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">{customer.phone || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">{customer.orders || 0} orders</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatCurrency(customer.totalSpent)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(customer.lastPurchase)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              aria-haspopup="true" 
              size="icon" 
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
            <DropdownMenuItem>Delete customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
