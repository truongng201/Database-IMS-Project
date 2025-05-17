import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomersTable } from "./customer-table";

export default async function ProductsPage() {
  return (
    <Tabs defaultValue="all">
      <CustomersTable customers={[]} offset={0} totalCustomers={0} />
    </Tabs>
  );
}
