"use client";

import { Tabs} from "@/components/ui/tabs";
import { CustomersTable } from "./customer-table";
import withAuth from "@/hooks/withAuth";

function CustomersPage() {
  return (
    <Tabs defaultValue="all">
      <CustomersTable customers={[]} offset={0} totalCustomers={0} />
    </Tabs>
  );
}

export default withAuth(CustomersPage);