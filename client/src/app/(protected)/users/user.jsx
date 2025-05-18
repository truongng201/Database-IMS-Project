import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function User({ user, warehouses, setError, setShowAlert }) {
  const [currentWarehouse, setCurrentWarehouse] = useState(
    user.warehouse_id || 0
  );
  const [currentWarehouseName, setCurrentWarehouseName] = useState(
    user.warehouse_name || "N/A"
  );
  const [isActive, setIsActive] = useState(user.is_active);

  // create new warehouses array with warehouse_id and warehouse_name this also include the N/A warehouse
  //
  warehouses = warehouses.map((warehouse) => ({
    warehouse_id: warehouse.warehouse_id,
    warehouse_name: warehouse.warehouse_name,
  }));
  warehouses = warehouses.filter(
    (warehouse) => warehouse.warehouse_id !== user.warehouse_id
  );
  // add N/A warehouse to the warehouses array
  warehouses = [
    {
      warehouse_id: user.warehouse_id || 0,
      warehouse_name: user.warehouse_name || "N/A",
    },
    ...warehouses,
  ];

  const activateUser = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if(currentWarehouse === 0) {
        setError("Please select a warehouse");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/activate-user?warehouse_id=${currentWarehouse}&user_id=${user.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        console.log("Failed to activate account:", errorData);
        return;
      }
      setIsActive(1);
    } catch (error) {
      setError("Error activating account");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      console.log("Error activating account:", error);
    }
  };

  const deactivateUser = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/deactivate-user?user_id=${user.user_id}&warehouse_id=${currentWarehouse}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        console.log("Failed to deactivate account:", errorData);
        return;
      }

      setIsActive(0);
    } catch (error) {
      setError("Error deactivating account");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      console.log("Error deactivating account:", error);
    }
  };

  return (
    <TableRow>
      <TableCell className="hidden w-[100px] sm:table-cell">
        <Image
          src={user.image_url || "https://api.dicebear.com/9.x/pixel-art/svg"}
          alt="User Avatar"
          width={40}
          height={40}
          className="aspect-square rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">{user.user_id}</TableCell>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            user.role_name === "admin"
              ? "border-gray-500 text-gray-500"
              : "border-blue-500 text-blue-500"
          )}
        >
          {user.role_name}
        </Badge>
      </TableCell>
      <TableCell>
        {isActive === 1 ? (
          <Badge variant="secondary" className="capitalize">
            Active
          </Badge>
        ) : (
          <Badge variant="destructive" className="capitalize">
            Inactive
          </Badge>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {currentWarehouseName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {warehouses.map((warehouse) => (
              <DropdownMenuItem
                key={warehouse.warehouse_id}
                onClick={() => {
                  setCurrentWarehouse(warehouse.warehouse_id);
                  setCurrentWarehouseName(warehouse.warehouse_name);
                }}
                className={cn(
                  warehouse.warehouse_id === currentWarehouse && "font-bold"
                )}
              >
                {warehouse.warehouse_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <button type="submit" onClick={activateUser}>
                Activate
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button type="submit" onClick={deactivateUser}>
                Deactivate
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button type="submit" onClick={activateUser}>Assigned warehouse</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
