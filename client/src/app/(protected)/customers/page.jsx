"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomersTable } from "./customer-table";
import withAuth from "@/hooks/withAuth";

function CustomersPage() {
  // Sample data for demonstration
  const sampleCustomers = [
    {
      id: "C001",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "555-123-4567",
      status: "active",
      orders: 12,
      totalSpent: 1299.99,
      lastPurchase: "2023-11-20"
    },
    {
      id: "C002",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "555-987-6543",
      status: "active",
      orders: 8,
      totalSpent: 749.50,
      lastPurchase: "2023-11-15"
    },
    {
      id: "C003",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-567-8901",
      status: "inactive",
      orders: 3,
      totalSpent: 179.95,
      lastPurchase: "2023-10-05"
    }
  ];

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
              Add Customer
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <CustomersTable 
          customers={sampleCustomers} 
          offset={3} 
          totalCustomers={3} 
        />
      </TabsContent>
      <TabsContent value="active">
        <CustomersTable 
          customers={sampleCustomers.filter(customer => customer.status === "active")} 
          offset={2} 
          totalCustomers={2} 
        />
      </TabsContent>
      <TabsContent value="inactive">
        <CustomersTable 
          customers={sampleCustomers.filter(customer => customer.status === "inactive")} 
          offset={1} 
          totalCustomers={1} 
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(CustomersPage);