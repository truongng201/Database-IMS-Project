"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "./products-table";
import withAuth from "@/hooks/withAuth";

function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || "";
  
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [user, setUser] = useState(null);
  const limit = 100;
  console.log(categories)
  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const fetchAll = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        
        // Build URL with search parameter if it exists
        const searchParam = searchQuery ? `search=${encodeURIComponent(searchQuery)}` : '';
        
        // Fetch total products
        const totalRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/count-total-products${searchParam ? `?${searchParam}` : ''}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (!totalRes.ok) {
          const errorData = await totalRes.json();
          setError(errorData?.message || "Failed to fetch total products");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const totalData = await totalRes.json();
        const total =
          totalData?.data?.total_products ?? totalData?.data?.totalProducts ?? 0;
        setTotalProducts(total);

        // Fetch products for current offset
        const chunkOffset = Math.floor(offset / limit) * limit;
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-products?limit=${limit}&offset=${chunkOffset}${searchParam ? `&${searchParam}` : ''}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (!productsRes.ok) {
          const errorData = await productsRes.json();
          setError(errorData?.message || "Failed to fetch products");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const productsData = await productsRes.json();
        setProducts(productsData?.data?.products || []);

        // Fetch categories
        const categoriesRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/categories`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData?.data || []);
        }
        // Fetch warehouses
        const warehousesRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-all-warehouses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (warehousesRes.ok) {
          const warehousesData = await warehousesRes.json();
          setWarehouses(warehousesData?.data || []);
        }

        // Fetch suppliers
        const suppliersRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier/get-all-suppliers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (suppliersRes.ok) {
          const suppliersData = await suppliersRes.json();
          setSuppliers(suppliersData?.data || []);
        }
      } catch (error) {
        setError("Error fetching data");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    fetchAll();
  }, [offset, searchQuery]); // Re-fetch when offset or search query changes

  // Handler to update offset from ProductsTable
  const handleOffsetChange = (newOffset) => {
    setOffset(newOffset);
  };

  // Add state for add product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addValues, setAddValues] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    quantity: "",
    supplier: "",
    warehouse: "",
    category_id: "",
    supplier_id: "",
    warehouse_id: "",
  });

  // Set default warehouse when user data is available and modal opens
  useEffect(() => {
    if (showAddModal && user && user.role_name === "Staff" && user.warehouse_id) {
      setAddValues(prev => ({
        ...prev,
        warehouse_id: user.warehouse_id
      }));
    }
  }, [showAddModal, user]);

  function handleAddInputChange(e) {
    const { name, value } = e.target;
    setAddValues((prev) => ({ ...prev, [name]: value }));
  }

  async function createProduct(e) {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      
      // Set warehouse_id based on user role_name
      let warehouseId = addValues.warehouse_id;
      if (user && user.role_name === "staff" && user.warehouse_id) {
        warehouseId = user.warehouse_id;
      }
      
      const body = {
        name: addValues.name,
        price: parseFloat(addValues.price),
        description: addValues.description,
        quantity: parseInt(addValues.quantity, 10),
        image_url: `https://api.dicebear.com/9.x/identicon/svg?seed=${addValues.name}`, // or allow upload
        category_id: addValues.category_id,
        supplier_id: addValues.supplier_id,
        warehouse_id: warehouseId,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/create-product`,
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
        setError(errorData?.message || "Failed to create product");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      setError("Product created successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setShowAddModal(false);
      setAddValues({
        name: "",
        price: "",
        category: "",
        description: "",
        quantity: "",
        supplier: "",
        warehouse: "",
        category_id: "",
        supplier_id: "",
        warehouse_id: user && user.role_name === "staff" && user.warehouse_id ? user.warehouse_id : "",
      });
    } catch (error) {
      setError("Error creating product");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  return (
    <Tabs defaultValue="all">
      {showAlert && (
        <div
          className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="flex items-center">
        {searchQuery && (
          <div className="mr-auto">
            <span className="text-sm text-muted-foreground">
              Search results for: <strong>"{searchQuery}"</strong>
            </span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => setShowAddModal(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <ProductsTable
          products={products}
          offset={offset}
          setOffset={handleOffsetChange}
          totalProducts={totalProducts}
          setError={setError}
          setShowAlert={setShowAlert}
          limit={limit}
          categories={categories}
          suppliers={suppliers}
          user={user}
          warehouses={warehouses}
        />
      </TabsContent>
      {showAddModal && (
        <div
          id="add-modal"
          tabIndex={-1}
          aria-hidden={!showAddModal}
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-40"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Product
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setShowAddModal(false)}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={createProduct}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="add-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" name="name" id="add-name" value={addValues.name} onChange={handleAddInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="add-price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input type="number" name="price" id="add-price" value={addValues.price} onChange={handleAddInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="add-category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                    <select id="add-category" name="category_id" value={addValues.category_id} onChange={handleAddInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="add-description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                    <textarea id="add-description" name="description" rows={4} value={addValues.description} onChange={handleAddInputChange} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write product description here" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="add-quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                    <input type="number" name="quantity" id="add-quantity" value={addValues.quantity} onChange={handleAddInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="100" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="add-supplier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Supplier</label>
                    <select id="add-supplier" name="supplier_id" value={addValues.supplier_id} onChange={handleAddInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.supplier_id} value={supplier.supplier_id}>
                          {supplier.supplier_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {user && user.role_name === "admin" && (
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="add-warehouse" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse</label>
                      <select id="add-warehouse" name="warehouse_id" value={addValues.warehouse_id} onChange={handleAddInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                        <option value="">Select warehouse</option>
                        {warehouses.map((warehouse) => (
                          <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>{warehouse.warehouse_name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {user && user.role_name === "staff" && (
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="add-warehouse-display" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse</label>
                      <input 
                        type="text" 
                        id="add-warehouse-display" 
                        value={warehouses.find(w => w.warehouse_id === user.warehouse_id)?.warehouse_name || "Your Warehouse"} 
                        className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400" 
                        disabled 
                      />
                    </div>
                  )}
                </div>
                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Tabs>
  );
}

export default withAuth(ProductsPage);
