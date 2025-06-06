import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

export function Product({ product, categories, setError, setShowAlert, suppliers, user, warehouses }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  // Modal state for editing
  const [editValues, setEditValues] = useState({
    name: product.name || "",
    price: product.price || "",
    category: product.category?.name || "",
    description: product.description || "",
    quantity: product.quantity || "",
    supplier_id: product.supplier?.supplier_id || "",
    warehouse_id: product.warehouse?.warehouse_id || "",
    category_id: product.category?.category_id || "",
    supplier: product.supplier?.name || "",
    warehouse: product.warehouse?.name || "",
    category_name: product.category?.name || "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  }

  // Helper to crop description to 120 characters
  function cropText(desc) {
    if (!desc) return "";
    const maxChars = 30;
    if (desc.length <= maxChars) return desc;
    return desc.slice(0, maxChars) + "...";
  }

  // Helper to format product ID as P0001, P0012, etc.
  function formatProductId(id) {
    return `P${id.toString().padStart(4, "0")}`;
  }

  // Separate delete handler for product deletion
  async function handleDeleteProduct() {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/delete-product?product_id=${product.product_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
        }
      );
      if (!response.ok) {
        setError("Failed to delete product");
        setShowAlert(true);
        return;
      }
      setError("");
      setShowAlert(true);
      window.location.reload();
    } catch (error) {
      setError("Error deleting product");
      setShowAlert(true);
    }
  }

  // Update product handler
  async function updateProduct(e) {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      const body = {
        product_id: product.product_id,
        name: editValues.name,
        price: parseFloat(editValues.price),
        description: editValues.description,
        quantity: parseInt(editValues.quantity, 10),
        image_url: product.image_url, // keep original image_url (or use editValues if you allow editing)
        category_id: editValues.category_id || product.category?.category_id,
        supplier_id: editValues.supplier_id || product.supplier?.supplier_id,
        warehouse_id: editValues.warehouse_id || product.warehouse?.warehouse_id,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update-product`,
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
        setError("Failed to update product");
        setShowAlert(true);
        return;
      }
      setError("");
      setShowAlert(true);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      setError("Error updating product");
      setShowAlert(true);
    }
  }

  return (
    <TableRow key={product.product_id}>
      <TableCell className="hidden sm:table-cell">
        <Image
          unoptimized
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          width={40}
          height={40}
          src={product.image_url || "https://api.dicebear.com/9.x/pixel-art/svg"}
        />
      </TableCell>
      <TableCell className="font-medium">
        {formatProductId(product.product_id)}
      </TableCell>
      <TableCell className="font-medium">{cropText(product.name)}</TableCell>
      <TableCell>{cropText(product.description)}</TableCell>
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
          {product.category?.name || "-"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.supplier?.name || "-"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.warehouse?.name || "-"}
      </TableCell>
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
            <DropdownMenuItem onClick={handleDeleteProduct}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      {showModal && (
        <td>
          <div
            key={product.product_id + "-modal"}
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
                    Details for {product.name}
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
                <form className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={editValues.name}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={editValues.price}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="$2999"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category_id"
                        value={editValues.category_id}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option value="">Select category</option>
                        {categories && categories.map((category) => (
                          <option
                            key={category.category_id}
                            value={category.category_id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={editValues.description}
                        onChange={handleInputChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write product description here"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="quantity"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        value={editValues.quantity}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="100"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="supplier"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Supplier
                      </label>
                      <select
                        name="supplier_id"
                        id="supplier"
                        value={editValues.supplier_id}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option value="">Select supplier</option>
                        {suppliers && suppliers.map((supplier) => (
                          <option
                            key={supplier.supplier_id}
                            value={supplier.supplier_id}
                          >
                            {supplier.supplier_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={updateProduct}
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
                      ></path>
                    </svg>
                    Save changes
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
