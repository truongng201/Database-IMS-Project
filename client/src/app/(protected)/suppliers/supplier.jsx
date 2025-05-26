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
import { useRouter } from 'next/navigation';

export function Supplier({ supplier, onClick }) {
  const router = useRouter();
  // Format date safely with fallback
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch (error) {
      return dateString || "N/A";
    }
  };

  // Crop string to max length, add ellipsis if needed
  const crop = (str, max = 12) => {
    if (!str) return "N/A";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  // Format supplier ID as Sxxxx (e.g., S0001)
  const formatSupplierId = (id) => {
    if (!id) return "N/A";
    const num = typeof id === 'string' && id.startsWith('S') ? id.slice(1) : id;
    return `S${String(num).padStart(4, '0')}`;
  };

  // Round average product price to 2 decimals
  const formatAvgPrice = (price) => {
    if (price == null) return "0.00";
    return Number(price).toFixed(2);
  };

  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell>{formatSupplierId(supplier.supplier_id)}</TableCell>
      <TableCell className="font-medium">{crop(supplier.supplier_name, 12)}</TableCell>
      <TableCell className="hidden md:table-cell">{crop(supplier.contact_name, 12)}</TableCell>
      <TableCell className="hidden md:table-cell">{crop(supplier.contact_email, 18)}</TableCell>
      <TableCell className="hidden md:table-cell">{supplier.phone || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">{supplier.total_products ?? 0}</TableCell>
      <TableCell className="hidden md:table-cell">{supplier.total_product_quantity ?? 0}</TableCell>
      <TableCell className="hidden md:table-cell">{formatAvgPrice(supplier.avg_product_price)}</TableCell>
      <TableCell className="hidden md:table-cell">{formatDate(supplier.supplier_created_time)}</TableCell>
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
            <DropdownMenuItem onClick={() => router.push(`/suppliers/${supplier.supplier_id}`)}>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit supplier</DropdownMenuItem>
            <DropdownMenuItem>Delete supplier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
