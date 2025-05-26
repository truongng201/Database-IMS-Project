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
  const [categories, setCategories] = useState([]);
  const limit = 100;
  console.log(categories)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        // Fetch total products
        const totalRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/count-total-products`,
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get-all-products?limit=${limit}&offset=${chunkOffset}`,
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
      } catch (error) {
        setError("Error fetching data");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    };
    fetchAll();
  }, [offset]);

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
          categories={categories}
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(ProductsPage);
