import Image from 'next/image';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Product({ product }) {
  // Helper to crop description to 120 characters
  function cropDescription(desc) {
    if (!desc) return '';
    const maxChars = 30;
    if (desc.length <= maxChars) return desc;
    return desc.slice(0, maxChars) + '...';
  }

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          width={40}
          height={40}
          src={product.image_url || '/placeholder.svg'}
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{cropDescription(product.description)}</TableCell>
      <TableCell className="hidden md:table-cell">{`$${product.price}`}</TableCell>
      <TableCell className="hidden md:table-cell">{product.quantity}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            product.category?.name === "Electronics"
              ? "bg-blue-100 border-blue-500 text-blue-700"
              : product.category?.name === "Books"
              ? "bg-yellow-100 border-yellow-500 text-yellow-700"
              : product.category?.name === "Clothing"
              ? "bg-green-100 border-green-500 text-green-700"
              : product.category?.name === "Toys"
              ? "bg-pink-100 border-pink-500 text-pink-700"
              : product.category?.name === "Furniture"
              ? "bg-orange-100 border-orange-500 text-orange-700"
              : product.category?.name === "Sports"
              ? "bg-lime-100 border-lime-500 text-lime-700"
              : product.category?.name === "Beauty"
              ? "bg-rose-100 border-rose-500 text-rose-700"
              : product.category?.name === "Automotive"
              ? "bg-gray-200 border-gray-500 text-gray-700"
              : product.category?.name === "Food"
              ? "bg-amber-100 border-amber-500 text-amber-700"
              : product.category?.name === "Health"
              ? "bg-teal-100 border-teal-500 text-teal-700"
              : "bg-gray-100 border-gray-400 text-gray-700"
          )}
        >
          {product.category?.name || '-'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.supplier?.name || '-'}</TableCell>
      <TableCell className="hidden md:table-cell">{product.warehouse?.name || '-'}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Update</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => {}}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
