import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { ProductsTable } from './products-table';

export default async function ProductsPage() {
  return (
    <Tabs defaultValue="all">
      Your information is being loaded...
    </Tabs>
  );
}
