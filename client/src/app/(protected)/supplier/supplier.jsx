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

export function Supplier({ supplier, onClick }) {
  // Format date safely with fallback
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch (error) {
      return dateString || "N/A";
    }
  };

  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell>{supplier.id}</TableCell>
      <TableCell className="font-medium">{supplier.name || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">{supplier.contactName || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">{supplier.email || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">{supplier.phone || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(supplier.lastOrder)}
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
            <DropdownMenuItem>Edit supplier</DropdownMenuItem>
            <DropdownMenuItem>Delete supplier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
