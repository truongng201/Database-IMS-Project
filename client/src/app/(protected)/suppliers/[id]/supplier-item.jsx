import { TableRow, TableCell } from "@/components/ui/table";

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

  return (
    <TableRow>
      <TableCell>{product.product_id}</TableCell>
      <TableCell>{crop(product.product_name, 20)}</TableCell>
      <TableCell>{crop(product.description, 30)}</TableCell>
      <TableCell>{Number(product.price).toFixed(2)}</TableCell>
      <TableCell>{product.quantity}</TableCell>
      <TableCell>{product.category_name}</TableCell>
      <TableCell>{formatDate(product.product_created_time)}</TableCell>
      <TableCell>{formatDate(product.product_updated_time)}</TableCell>
    </TableRow>
  );
}
