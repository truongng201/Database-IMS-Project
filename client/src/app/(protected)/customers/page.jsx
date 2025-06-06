"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomersTable } from "./customer-table";
import withAuth from "@/hooks/withAuth";

function CustomersPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || "";
  
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        
        // Build URL with search parameter if it exists
        const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
        
        // Fetch total customers
        const totalRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/count-customers`,
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
          setError(errorData?.message || "Failed to fetch total customers");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const totalData = await totalRes.json();
        setTotalCustomers(totalData?.data || 0);

        // Fetch all customers with search parameter
        const customersRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/get-all-customers${searchParam}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (!customersRes.ok) {
          const errorData = await customersRes.json();
          setError(errorData?.message || "Failed to fetch customers");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const customersData = await customersRes.json();
        setCustomers(customersData?.data || []);
      } catch (error) {
        setError("Error fetching data");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    fetchAll();
  }, [searchQuery]); // Re-fetch when search query changes

  const handleOffsetChange = (newOffset) => setOffset(newOffset);
  const paginatedCustomers = customers.slice(offset, offset + limit);

  // Add state for add customer modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addValues, setAddValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  function handleAddInputChange(e) {
    const { name, value } = e.target;
    setAddValues((prev) => ({ ...prev, [name]: value }));
  }

  async function createCustomer(e) {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      const body = {
        name: addValues.name,
        phone: addValues.phone,
        email: addValues.email || null, // email is optional
        address: addValues.address || "",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/create-customer`,
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
        setError(errorData?.message || "Failed to create customer");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }
      setError("Customer created successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setShowAddModal(false);
      setAddValues({ name: "", email: "", phone: "", address: "" });
      
      // Refresh the customers list
      window.location.reload();
    } catch (error) {
      setError("Error creating customer");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  return (
    <Tabs defaultValue="all">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg" role="alert">
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
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => setShowAddModal(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Customer</span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <CustomersTable
          customers={paginatedCustomers}
          offset={offset}
          setOffset={handleOffsetChange}
          totalCustomers={totalCustomers}
          limit={limit}
          setError={setError}
          setShowAlert={setShowAlert}
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
                  Add New Customer
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
              <form className="p-4 md:p-5" onSubmit={createCustomer}>
                <div className="grid gap-4 mb-4 grid-cols-1">
                  <div>
                    <label htmlFor="add-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Name *
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      id="add-name" 
                      value={addValues.name} 
                      onChange={handleAddInputChange} 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      placeholder="Enter customer name" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="add-email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      id="add-email" 
                      value={addValues.email} 
                      onChange={handleAddInputChange} 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                      placeholder="Enter email address" 
                    />
                  </div>
                  <div>
                    <label htmlFor="add-phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Phone *
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      id="add-phone" 
                      value={addValues.phone} 
                      onChange={handleAddInputChange} 
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
                  <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  Add Customer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
    </Tabs>
  );
}

function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersPageContent />
    </Suspense>
  );
}

export default withAuth(CustomersPage);