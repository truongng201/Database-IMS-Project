"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrdersTable } from './orders-table';
import withAuth from '@/hooks/withAuth';

function OrdersPage() {
  // Sample data for demonstration
  const sampleOrders = [
    {
      id: "1001",
      customerName: "Jane Doe",
      status: "pending",
      date: "2023-11-20",
      total: 299.99,
      items: 3,
      paymentMethod: "Credit Card"
    },
    {
      id: "1002",
      customerName: "John Smith",
      status: "completed",
      date: "2023-11-19",
      total: 149.50,
      items: 2,
      paymentMethod: "PayPal"
    },
    {
      id: "1003",
      customerName: "Alice Johnson",
      status: "cancelled",
      date: "2023-11-18",
      total: 79.95,
      items: 1,
      paymentMethod: "Debit Card"
    }
  ];

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Pending</TabsTrigger>
          <TabsTrigger value="draft">Completed</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Cancelled
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
          orders={sampleOrders}
          offset={3}
          totalOrders={3}
        />
      </TabsContent>
      <TabsContent value="active">
        <OrdersTable
          orders={sampleOrders.filter(order => order.status === "pending")}
          offset={1}
          totalOrders={1}
        />
      </TabsContent>
      <TabsContent value="draft">
        <OrdersTable
          orders={sampleOrders.filter(order => order.status === "completed")}
          offset={1}
          totalOrders={1}
        />
      </TabsContent>
      <TabsContent value="archived">
        <OrdersTable
          orders={sampleOrders.filter(order => order.status === "cancelled")}
          offset={1}
          totalOrders={1}
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(OrdersPage);
