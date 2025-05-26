"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomersTable } from "./customer-table";
import withAuth from "@/hooks/withAuth";

function CustomersPage() {
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

        // Fetch all customers
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
  }, []);

  const handleOffsetChange = (newOffset) => setOffset(newOffset);
  const paginatedCustomers = customers.slice(offset, offset + limit);

  return (
    <Tabs defaultValue="all">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg" role="alert">
          {error}
        </div>
      )}
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
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
        />
      </TabsContent>
      
    </Tabs>
  );
}

export default withAuth(CustomersPage);