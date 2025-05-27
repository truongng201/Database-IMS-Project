"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrdersTable } from './orders-table';
import withAuth from '@/hooks/withAuth';

function OrdersPage() {
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-all-orders`,
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
  }, []);

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

  // Debug logging
  console.log("Offsets:", offsets);
  console.log("Active tab:", activeTab);
  console.log("All orders length:", allOrders.length);
  console.log("Pending orders length:", pendingOrders.length);
  console.log("Completed orders length:", completedOrders.length);
  console.log("Cancelled orders length:", cancelledOrders.length);

  return (
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
          <Button size="sm" className="h-8 gap-1">
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
        />
      </TabsContent>
      <TabsContent value="pending">
        <OrdersTable
          orders={paginatedPendingOrders}
          offset={offsets.pending}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, pending: newOffset }))}
          totalOrders={pendingOrders.length}
          limit={limit}
        />
      </TabsContent>
      <TabsContent value="completed">
        <OrdersTable
          orders={paginatedCompletedOrders}
          offset={offsets.completed}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, completed: newOffset }))}
          totalOrders={completedOrders.length}
          limit={limit}
        />
      </TabsContent>
      <TabsContent value="cancelled">
        <OrdersTable
          orders={paginatedCancelledOrders}
          offset={offsets.cancelled}
          setOffset={(newOffset) => setOffsets(prev => ({ ...prev, cancelled: newOffset }))}
          totalOrders={cancelledOrders.length}
          limit={limit}
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(OrdersPage);
