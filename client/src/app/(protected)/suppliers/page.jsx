"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierTable } from "./supplier-table";
import withAuth from "@/hooks/withAuth";
import { useEffect, useState } from "react";

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5); // Default page size

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        // Fetch total suppliers
        const totalRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier/count-suppliers`,
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
          setError(errorData?.message || "Failed to fetch total suppliers");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const totalData = await totalRes.json();
        const total = totalData?.data || 0;
        setTotalSuppliers(total);

        // Fetch all suppliers (no limit/offset)
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
        if (!suppliersRes.ok) {
          const errorData = await suppliersRes.json();
          setError(errorData?.message || "Failed to fetch suppliers");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData?.data || []);
      } catch (error) {
        setError("Error fetching data");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    fetchAll();
  }, []);

  // Handler to update offset from SupplierTable
  const handleOffsetChange = (newOffset) => {
    setOffset(newOffset);
  };

  // Calculate paginated suppliers for current page
  const paginatedSuppliers = suppliers.slice(offset, offset + limit);

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
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Supplier
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <SupplierTable
          suppliers={paginatedSuppliers}
          offset={offset}
          setOffset={handleOffsetChange}
          totalSuppliers={totalSuppliers}
          limit={limit}
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(SuppliersPage);