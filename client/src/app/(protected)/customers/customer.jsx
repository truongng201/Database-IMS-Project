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
import { useState, useRef } from 'react';

export function Customer({ customer, onClick, setError, setShowAlert }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  // Modal state for editing
  const [editValues, setEditValues] = useState({
    name: customer.customer_name || customer.name || "",
    email: customer.email || customer.contact_email || "",
    phone: customer.phone || "",
    address: customer.address || "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  }
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

  // Delete customer handler
  async function handleDeleteCustomer() {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/delete-customer/${customer.customer_id}`,
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
        setError(errorData?.message || "Failed to delete customer");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      setError("Customer deleted successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      window.location.reload();
    } catch (error) {
      setError("Error deleting customer");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  // Update customer handler
  async function updateCustomer(e) {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      const body = {
        name: editValues.name,
        email: editValues.email || null,
        phone: editValues.phone,
        address: editValues.address || "",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/update-customer/${customer.customer_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Failed to update customer");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      setError("Customer updated successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      setError("Error updating customer");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

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
            <DropdownMenuItem onClick={() => setShowModal(true)}>
              Edit customer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteCustomer}>
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      {showModal && (
        <td>
          <div
            key={customer.customer_id + "-modal"}
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
                    Edit Customer: {customer.customer_name || customer.name}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowModal(false)}
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
                <form className="p-4 md:p-5" onSubmit={updateCustomer}>
                  <div className="grid gap-4 mb-4 grid-cols-1">
                    <div>
                      <label
                        htmlFor="edit-name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="edit-name"
                        value={editValues.name}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="edit-email"
                        value={editValues.email}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-phone"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="edit-phone"
                        value={editValues.phone}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Update Customer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </td>
      )}
    </TableRow>
  );
}
