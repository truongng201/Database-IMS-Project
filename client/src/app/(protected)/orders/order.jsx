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
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export function Order({ order, onClick, setError, setShowAlert, onStatusUpdate }) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const modalRef = useRef();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/update-order-status?order_id=${orderId}&status=${status}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to update order status");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      setError(`Order status updated to ${status} successfully!`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Call parent component to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      setError("Error updating order status");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/delete-order/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to delete order");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      setError(`Order ${formatOrderId(orderId)} deleted successfully!`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Close modal and call parent component to refresh data
      setShowDeleteModal(false);
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      setError("Error deleting order");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Format order ID as O0001
  const formatOrderId = (id) => `ORD-${String(id).padStart(4, '0')}`;

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
            <DropdownMenuItem onClick={() => router.push(`/orders/${order.order_id}`)}>View details</DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(order.order_id, 'completed');
              }}
              disabled={order.order_status === 'completed'}
            >
              Complete order
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(order.order_id, 'cancelled');
              }}
              disabled={order.order_status === 'cancelled'}
            >
              Cancel order
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="text-red-600 hover:text-red-700 focus:text-red-700"
            >
              Delete order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <td>
          <div
            key={order.order_id + "-delete-modal"}
            id="delete-modal"
            tabIndex={-1}
            aria-hidden={!showDeleteModal}
            ref={modalRef}
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-40"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Order {formatOrderId(order.order_id)}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <div className="text-center">
                    <svg
                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete order {formatOrderId(order.order_id)}?
                    </h3>
                    <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                      This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => deleteOrder(order.order_id)}
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      )}
    </TableRow>
  );
} 