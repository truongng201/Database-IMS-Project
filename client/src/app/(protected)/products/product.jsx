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
import { useState, useRef } from 'react';

export function Product({ product }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  // Helper to crop description to 120 characters
  function cropDescription(desc) {
    if (!desc) return '';
    const maxChars = 30;
    if (desc.length <= maxChars) return desc;
    return desc.slice(0, maxChars) + '...';
  }

  return [
    <TableRow key={product.product_id}>
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
            <DropdownMenuItem onClick={() => setShowModal(true)}>
              See details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={() => {}}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>,
    showModal && (
      <div
        key={product.product_id + '-modal'}
        id="crud-modal"
        tabIndex={-1}
        aria-hidden={!showModal}
        ref={modalRef}
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-40"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Details
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="mb-4 flex justify-center">
                <Image
                  alt="Product image"
                  className="aspect-square rounded-md object-cover mb-4"
                  width={120}
                  height={120}
                  src={product.image_url || '/placeholder.svg'}
                />
              </div>
              <div className="mb-2">
                <strong>Name:</strong> {product.name}
              </div>
              <div className="mb-2">
                <strong>Description:</strong> {product.description}
              </div>
              <div className="mb-2">
                <strong>Price:</strong> ${product.price}
              </div>
              <div className="mb-2">
                <strong>Quantity:</strong> {product.quantity}
              </div>
              <div className="mb-2">
                <strong>Category:</strong> {product.category?.name}
              </div>
              <div className="mb-2">
                <strong>Supplier:</strong> {product.supplier?.name}
              </div>
              <div className="mb-2">
                <strong>Warehouse:</strong> {product.warehouse?.name}
              </div>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  ];
}
