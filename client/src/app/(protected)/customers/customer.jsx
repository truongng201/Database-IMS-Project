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

  // Format customer ID as Cxxxx (e.g., C0001)
  const formatCustomerId = (id) => {
    if (!id) return "N/A";
    const num = typeof id === 'string' && id.startsWith('C') ? id.slice(1) : id;
    return `C${String(num).padStart(4, '0')}`;
  };

  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell>{formatCustomerId(customer.customer_id)}</TableCell>
      <TableCell className="font-medium">{customer.customer_name || customer.name}</TableCell>
      <TableCell>{customer.email || customer.contact_email}</TableCell>
      <TableCell>{customer.phone}</TableCell>
      <TableCell>{customer.total_number_orders ?? 0}</TableCell>
      <TableCell>{formatCurrency(customer.total_spent ?? 0)}</TableCell>
      <TableCell>{formatDate(customer.last_purchase_time)}</TableCell>
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
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
            <DropdownMenuItem>Delete customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
