"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierTable } from "./supplier-item-table";
import withAuth from "@/hooks/withAuth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function SuppliersItemPage() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5); // Default page size

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier/get-supplier/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData?.message || "Failed to fetch supplier");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const data = await res.json();
        setSupplier(data?.data || null);
      } catch (error) {
        setError("Error fetching data");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    if (id) fetchSupplier();
  }, [id]);

  // Handler to update offset from SupplierTable
  const handleOffsetChange = (newOffset) => {
    setOffset(newOffset);
  };

  // Calculate paginated products for current page
  const paginatedProducts =
    supplier?.products?.slice(offset, offset + limit) || [];

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

      <TabsContent value="all">
        <SupplierTable
          supplier={supplier}
          products={paginatedProducts}
          offset={offset}
          setOffset={handleOffsetChange}
          totalProducts={supplier?.products?.length || 0}
          limit={limit}
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(SuppliersItemPage);
