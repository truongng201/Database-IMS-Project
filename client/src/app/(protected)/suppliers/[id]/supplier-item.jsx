import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SupplierItem({ product }) {
  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return dateString || "N/A";
    }
  };

  // Crop string to max length, add ellipsis if needed
  const crop = (str, max = 20) => {
    if (!str) return "N/A";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  // Format product ID as Pxxxx (e.g., P0001)
  const formatProductId = (id) => {
    if (!id) return "N/A";
    const num = typeof id === 'string' && id.startsWith('P') ? id.slice(1) : id;
    return `P${String(num).padStart(4, '0')}`;
  };

  // Format currency for price
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <TableRow>
      <TableCell>{formatProductId(product.product_id)}</TableCell>
      <TableCell>{crop(product.product_name, 20)}</TableCell>
      <TableCell>{crop(product.description, 30)}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell>{product.quantity}</TableCell>
      <TableCell><Badge variant="outline">{product.category_name}</Badge></TableCell>
      <TableCell>{formatDate(product.product_created_time)}</TableCell>
      <TableCell>{formatDate(product.product_updated_time)}</TableCell>
    </TableRow>
  );
}
