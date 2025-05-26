"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierTable } from "./supplier-table";
import withAuth from "@/hooks/withAuth";

function SuppliersPage() {
  // Sample data for demonstration
  const sampleSuppliers = [
    {
      id: "S001",
      name: "Global Electronics Inc.",
      contactName: "Michael Chen",
      email: "m.chen@globalelectronics.com",
      phone: "555-234-5678",
      status: "active",
      products: 25,
      lastOrder: "2023-11-15"
    },
    {
      id: "S002",
      name: "Acme Office Supplies",
      contactName: "Sarah Johnson",
      email: "sarah.j@acmesupplies.com",
      phone: "555-876-5432",
      status: "active",
      products: 42,
      lastOrder: "2023-11-10"
    },
    {
      id: "S003",
      name: "Metro Food Distributors",
      contactName: "David Wilson",
      email: "d.wilson@metrofood.com",
      phone: "555-345-6789",
      status: "inactive",
      products: 18,
      lastOrder: "2023-10-22"
    }
  ];

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All Suppliers</TabsTrigger>
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
              Add Supplier
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <SupplierTable 
          suppliers={sampleSuppliers} 
          offset={3} 
          totalSuppliers={3} 
        />
      </TabsContent>
      <TabsContent value="active">
        <SupplierTable 
          suppliers={sampleSuppliers.filter(supplier => supplier.status === "active")} 
          offset={2} 
          totalSuppliers={2} 
        />
      </TabsContent>
      <TabsContent value="inactive">
        <SupplierTable 
          suppliers={sampleSuppliers.filter(supplier => supplier.status === "inactive")} 
          offset={1} 
          totalSuppliers={1} 
        />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(SuppliersPage);