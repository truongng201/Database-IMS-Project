"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrdersTable } from './orders-table';
import withAuth from '@/hooks/withAuth';

// Custom SearchableProductSelector Component
function SearchableProductSelector({ 
  itemIndex, 
  productSearchState, 
  onSearch, 
  onToggleDropdown, 
  onSelectProduct, 
  onLoadMore,
  selectedProduct,
  onSearchTermChange
}) {
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle search input change (no auto-search)
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    
    // Update search term in state but don't trigger search yet
    onSearchTermChange(itemIndex, searchTerm);
  };

  // Handle Enter key press to trigger search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchTerm = productSearchState?.searchTerm || "";
      onSearch(itemIndex, searchTerm);
    }
  };

  // Handle scroll to load more products
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      onLoadMore(itemIndex);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggleDropdown(itemIndex, false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [itemIndex, onToggleDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={productSearchState?.searchTerm || ""}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onClick={() => onToggleDropdown(itemIndex, true)}
          placeholder={selectedProduct ? selectedProduct.name : "Search for products... (Press Enter to search)"}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {productSearchState?.isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-500">
          {productSearchState.loading && productSearchState.products.length === 0 ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              Loading products...
            </div>
          ) : productSearchState.products.length === 0 ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              No products found
            </div>
          ) : (
            <div onScroll={handleScroll}>
              {productSearchState.products.map((product) => (
                <div
                  key={product.product_id}
                  onClick={() => onSelectProduct(itemIndex, product)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Price: ${product.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Stock: {product.quantity || 0}
                      </div>
                      {(product.quantity || 0) <= 10 && (
                        <div className="text-xs text-red-600 dark:text-red-400">
                          {product.quantity === 0 ? 'Out of stock' : 'Low stock'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {productSearchState.loading && (
                <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                  Loading more...
                </div>
              )}
              
              {!productSearchState.hasMore && productSearchState.products.length > 0 && (
                <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No more products to load
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || "";
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [offsets, setOffsets] = useState({
    all: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });
  const [limit, setLimit] = useState(5);

  // Add order modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [addValues, setAddValues] = useState({
    customer_id: "",
    items: [{ product_id: "", quantity: 1, price: 0, selectedProduct: null }]
  });
  
  // Product search state for each item
  const [productSearchStates, setProductSearchStates] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        
        // Build URL with search parameter if it exists
        const searchParam = searchQuery ? `search=${encodeURIComponent(searchQuery)}` : '';
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-all-orders${searchParam ? `?${searchParam}` : ''}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData?.message || "Failed to fetch orders");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        
        const data = await response.json();
        setOrders(data?.data || []);
      } catch (error) {
        setError("Error fetching orders");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    
    fetchOrders();
  }, [searchQuery]); // Re-fetch when search query changes

  // New useEffect to fetch customers when modal opens
  useEffect(() => {
    if (showAddModal) {
      const fetchCustomers = async () => {
        try {
          const access_token = localStorage.getItem("access_token");
          
          // Fetch customers
          const customersRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/get-all-customers`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${access_token}`,
              },
            }
          );
          if (customersRes.ok) {
            const customersData = await customersRes.json();
            setCustomers(customersData?.data || []);
          }
        } catch (error) {
          setError(`Error fetching customers: ${error.message}`);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      };
      
      fetchCustomers();
      
      // Initialize product search states for each item
      const initialSearchStates = {};
      addValues.items.forEach((_, index) => {
        initialSearchStates[index] = {
          searchTerm: "",
          products: [],
          offset: 0,
          hasMore: true,
          loading: false,
          isOpen: false
        };
      });
      setProductSearchStates(initialSearchStates);
    }
  }, [showAddModal]);

  // Function to fetch products for a specific item with search and pagination
  const fetchProductsForItem = async (itemIndex, searchTerm = "", offset = 0, reset = false) => {
    const currentState = productSearchStates[itemIndex];
    if (!currentState || currentState.loading) return;
    
    setProductSearchStates(prev => ({
      ...prev,
      [itemIndex]: { ...prev[itemIndex], loading: true }
    }));
    
    try {
      const access_token = localStorage.getItem("access_token");
      
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-products?limit=50&offset=${offset}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const productsRes = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${access_token}`,
        },
      });
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const newProducts = productsData?.data?.products || [];
        
        setProductSearchStates(prev => ({
          ...prev,
          [itemIndex]: {
            ...prev[itemIndex],
            products: reset ? newProducts : [...prev[itemIndex].products, ...newProducts],
            hasMore: newProducts.length === 50,
            offset: offset + newProducts.length,
            loading: false
          }
        }));
      }
    } catch (error) {
      setError(`Error fetching products: ${error.message}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      setProductSearchStates(prev => ({
        ...prev,
        [itemIndex]: { ...prev[itemIndex], loading: false }
      }));
    }
  };

  // Handle product search input change
  const handleProductSearch = (itemIndex, searchTerm) => {
    setProductSearchStates(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        searchTerm,
        products: [],
        offset: 0,
        hasMore: true
      }
    }));
    
    // Immediately trigger search
    fetchProductsForItem(itemIndex, searchTerm, 0, true);
  };

  // Handle search term change (for input only, doesn't trigger search)
  const handleSearchTermChange = (itemIndex, searchTerm) => {
    setProductSearchStates(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        searchTerm
      }
    }));
  };

  // Handle dropdown toggle
  const toggleProductDropdown = (itemIndex, isOpen) => {
    setProductSearchStates(prev => ({
      ...prev,
      [itemIndex]: { ...prev[itemIndex], isOpen }
    }));
    
    // Load initial products when opening dropdown
    if (isOpen && (!productSearchStates[itemIndex]?.products?.length)) {
      fetchProductsForItem(itemIndex, "", 0, true);
    }
  };

  // Handle product selection
  const handleProductSelect = (itemIndex, product) => {
    const updatedItems = [...addValues.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      product_id: product.product_id,
      price: product.price,
      selectedProduct: product,
      quantity: Math.min(updatedItems[itemIndex].quantity, product.quantity || 1)
    };
    
    setAddValues(prev => ({ ...prev, items: updatedItems }));
    
    // Close dropdown and update search term
    setProductSearchStates(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        isOpen: false,
        searchTerm: product.name
      }
    }));
  };

  // Load more products in dropdown
  const loadMoreProducts = (itemIndex) => {
    const currentState = productSearchStates[itemIndex];
    if (currentState && currentState.hasMore && !currentState.loading) {
      fetchProductsForItem(itemIndex, currentState.searchTerm, currentState.offset, false);
    }
  };

  // Add order form handlers
  function handleAddInputChange(e) {
    const { name, value } = e.target;
    setAddValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleItemChange(index, field, value) {
    const updatedItems = [...addValues.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If quantity changes, validate against stock
    if (field === 'quantity' && updatedItems[index].selectedProduct) {
      const maxQuantity = updatedItems[index].selectedProduct.quantity || 0;
      if (value > maxQuantity) {
        setError(`Only ${maxQuantity} units available in stock`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        updatedItems[index].quantity = maxQuantity;
      }
    }
    
    setAddValues((prev) => ({ ...prev, items: updatedItems }));
  }

  function addNewItem() {
    setAddValues((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, price: 0, selectedProduct: null }]
    }));
    
    // Initialize search state for new item
    const newIndex = addValues.items.length;
    setProductSearchStates(prev => ({
      ...prev,
      [newIndex]: {
        searchTerm: "",
        products: [],
        offset: 0,
        hasMore: true,
        loading: false,
        isOpen: false
      }
    }));
  }

  function removeItem(index) {
    if (addValues.items.length > 1) {
      const updatedItems = addValues.items.filter((_, i) => i !== index);
      setAddValues((prev) => ({ ...prev, items: updatedItems }));
    }
  }

  function calculateTotal() {
    return addValues.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0).toFixed(2);
  }

  async function createOrder(e) {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      
      // Validate form
      if (!addValues.customer_id) {
        setError("Please select a customer");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      
      const validItems = addValues.items.filter(item => 
        item.product_id && item.quantity > 0 && item.price > 0 && item.selectedProduct
      );
      
      if (validItems.length === 0) {
        setError("Please add at least one valid product");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      // Validate stock quantities
      for (const item of validItems) {
        const availableStock = item.selectedProduct?.quantity || 0;
        if (item.quantity > availableStock) {
          setError(`Insufficient stock for ${item.selectedProduct.name}. Available: ${availableStock}, Requested: ${item.quantity}`);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
      }

      const body = {
        customer_id: parseInt(addValues.customer_id),
        items: validItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        })),
        status: "pending"
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/create-order`,
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
        setError(errorData?.message || "Failed to create order");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      setError("Order created successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setShowAddModal(false);
      
      // Reset form
      setAddValues({
        customer_id: "",
        items: [{ product_id: "", quantity: 1, price: 0, selectedProduct: null }]
      });
      
      // Refresh orders
      await handleStatusUpdate();
    } catch (error) {
      setError("Error creating order");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Filter orders by status for different tabs
  const allOrders = orders;
  const pendingOrders = orders.filter(order => order.order_status === "pending");
  const completedOrders = orders.filter(order => order.order_status === "completed");
  const cancelledOrders = orders.filter(order => order.order_status === "cancelled");

  // Paginate orders for each tab using their individual offsets
  const paginatedAllOrders = allOrders.slice(offsets.all, offsets.all + limit);
  const paginatedPendingOrders = pendingOrders.slice(offsets.pending, offsets.pending + limit);
  const paginatedCompletedOrders = completedOrders.slice(offsets.completed, offsets.completed + limit);
  const paginatedCancelledOrders = cancelledOrders.slice(offsets.cancelled, offsets.cancelled + limit);

  // Function to refresh orders after status update
  const handleStatusUpdate = async () => {
    // Reset offsets to first page
    setOffsets({
      all: 0,
      pending: 0,
      completed: 0,
      cancelled: 0
    });
    
    // Re-fetch orders
    try {
      const access_token = localStorage.getItem("access_token");
      const searchParam = searchQuery ? `search=${encodeURIComponent(searchQuery)}` : '';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-all-orders${searchParam ? `?${searchParam}` : ''}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data?.data || []);
      }
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Search results for: <strong>"{searchQuery}"</strong> ({orders.length} found)
        </div>
      )}
      
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg" role="alert">
          {error}
        </div>
      )}
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled" className="hidden sm:flex">
            Cancelled ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>
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
              Add Order
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <OrdersTable
          orders={paginatedAllOrders}
          offset={offsets.all}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, all: newOffset }))}
          totalOrders={allOrders.length}
          limit={limit}
          setError={setError}
          setShowAlert={setShowAlert}
          onStatusUpdate={handleStatusUpdate}
        />
      </TabsContent>
      <TabsContent value="pending">
        <OrdersTable
          orders={paginatedPendingOrders}
          offset={offsets.pending}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, pending: newOffset }))}
          totalOrders={pendingOrders.length}
          limit={limit}
          setError={setError}
          setShowAlert={setShowAlert}
          onStatusUpdate={handleStatusUpdate}
        />
      </TabsContent>
      <TabsContent value="completed">
        <OrdersTable
          orders={paginatedCompletedOrders}
          offset={offsets.completed}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, completed: newOffset }))}
          totalOrders={completedOrders.length}
          limit={limit}
          setError={setError}
          setShowAlert={setShowAlert}
          onStatusUpdate={handleStatusUpdate}
        />
      </TabsContent>
      <TabsContent value="cancelled">
        <OrdersTable
          orders={paginatedCancelledOrders}
          offset={offsets.cancelled}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, cancelled: newOffset }))}
          totalOrders={cancelledOrders.length}
          limit={limit}
          setError={setError}
          setShowAlert={setShowAlert}
          onStatusUpdate={handleStatusUpdate}
        />
      </TabsContent>

      {/* Add Order Modal */}
      {showAddModal && (
        <div
          id="add-order-modal"
          tabIndex={-1}
          aria-hidden={!showAddModal}
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-40"
        >
          <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Order
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
              <form className="p-4 md:p-5" onSubmit={createOrder}>
                <div className="grid gap-4 mb-4">
                  {/* Customer Selection */}
                  <div>
                    <label htmlFor="add-customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Customer *
                    </label>
                    <select 
                      id="add-customer" 
                      name="customer_id" 
                      value={addValues.customer_id} 
                      onChange={handleAddInputChange} 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      required
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer.customer_id} value={customer.customer_id}>
                          {customer.name || customer.customer_name} - {customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Products Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Products *
                      </label>
                      <Button
                        type="button"
                        onClick={addNewItem}
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Add Product
                      </Button>
                    </div>
                    
                    {addValues.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-600">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                          {/* Product Selection */}
                          <div className="lg:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                              Product
                            </label>
                            <SearchableProductSelector
                              itemIndex={index}
                              productSearchState={productSearchStates[index]}
                              onSearch={handleProductSearch}
                              onToggleDropdown={toggleProductDropdown}
                              onSelectProduct={handleProductSelect}
                              onLoadMore={loadMoreProducts}
                              selectedProduct={item.selectedProduct}
                              onSearchTermChange={handleSearchTermChange}
                            />
                          </div>
                          
                          {/* Quantity */}
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                              Quantity
                              {item.selectedProduct && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                  (Max: {item.selectedProduct.quantity || 0})
                                </span>
                              )}
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={item.selectedProduct?.quantity || 999}
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                              required
                            />
                            {item.selectedProduct && item.quantity > (item.selectedProduct.quantity || 0) && (
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Exceeds available stock
                              </div>
                            )}
                          </div>
                          
                          {/* Unit Price */}
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                              Unit Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                              required
                            />
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-end">
                            {addValues.items.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeItem(index)}
                                size="sm"
                                variant="destructive"
                                className="h-10 w-full"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Subtotal and Stock Info */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-500 flex justify-between items-center">
                          {item.selectedProduct && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Stock Available: <span className="font-medium">{item.selectedProduct.quantity || 0}</span> units
                              {(item.selectedProduct.quantity || 0) <= 10 && (
                                <span className="text-red-600 dark:text-red-400 ml-2">
                                  {item.selectedProduct.quantity === 0 ? '(Out of stock)' : '(Low stock)'}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            Subtotal: ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4 mt-2">
                    <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          Order Total:
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  Create Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Tabs>
    </div>
  );
}

export default withAuth(OrdersPageContent);
