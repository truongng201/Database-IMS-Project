"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierTable } from "./supplier-table";
import withAuth from "@/hooks/withAuth";

function SuppliersPage() {
  return (
    <Tabs defaultValue="all">
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
        <SupplierTable suppliers={[]} offset={0} totalSuppliers={0} />
      </TabsContent>
    </Tabs>
  );
}

export default withAuth(SuppliersPage);