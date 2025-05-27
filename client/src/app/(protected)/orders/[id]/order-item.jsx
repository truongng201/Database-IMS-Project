import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function OrderItem({ item }) {
  // Format product ID as Pxxxx (e.g., P0001)
  const formatProductId = (id) => {
    if (!id) return "N/A";
    const num = typeof id === 'string' && id.startsWith('P') ? id.slice(1) : id;
    return `P${String(num).padStart(4, '0')}`;
  };

  // Format currency - handle string values from API
  const formatCurrencyValue = (value) => {
    if (value === undefined || value === null) return "N/A";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return formatCurrency(numValue);
  };

  // Parse numeric values that come as strings
  const parseNumericValue = (value) => {
    if (value === undefined || value === null) return 0;
    const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(parsed) ? 0 : parsed;
  };

  // Crop string to max length, add ellipsis if needed
  const crop = (str, max = 20) => {
    if (!str) return "N/A";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {formatProductId(item.product_id)}
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {crop(item.product_name, 25)}
        </div>
        {item.description && (
          <div className="text-sm text-muted-foreground">
            {crop(item.description, 30)}
          </div>
        )}
      </TableCell>
      <TableCell>
        {formatCurrencyValue(item.product_price)}
      </TableCell>
      <TableCell className="font-medium">
        {parseNumericValue(item.quantity_ordered)}
      </TableCell>
      <TableCell className="font-semibold">
        {formatCurrencyValue(item.price)}
      </TableCell>
    </TableRow>
  );
}
