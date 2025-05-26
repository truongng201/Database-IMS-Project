"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "./products-table";
import withAuth from "@/hooks/withAuth";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 100; // backend fetch chunk size
  console.log("Total Products:", totalProducts);
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/count-total-products`,
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
          setError(errorData?.message || "Failed to fetch total products");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const data = await response.json();
        // Fix: support both snake_case and camelCase keys from backend
        const total =
          data?.data?.total_products ?? data?.data?.totalProducts ?? 0;
        setTotalProducts(total);
      } catch (error) {
        setError("Error fetching total products");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    fetchTotalProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        // Always fetch the chunk for the current offset
        const chunkOffset = Math.floor(offset / limit) * limit;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-products?limit=${limit}&offset=${chunkOffset}`,
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
          setError(errorData?.message || "Failed to fetch products");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        const data = await response.json();
        setProducts(data?.data?.products || []);
      } catch (error) {
        setError("Error fetching products");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    fetchProducts();
  }, [offset, totalProducts]);

  // Handler to update offset from ProductsTable
  const handleOffsetChange = (newOffset) => {
    setOffset(newOffset);
  };

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
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(ProductsPage);
