"use client";
import withAuth from "@/hooks/withAuth";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { BarChart, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useState, useEffect } from "react";

function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(dashboardStats)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const access_token = localStorage.getItem("access_token");
        
        // Fetch dashboard statistics
        const statsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/dashboard-stats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }
        
        const statsData = await statsResponse.json();
        setDashboardStats(statsData?.data || null);

        // Fetch recent orders
        const ordersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/recent-completed`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch recent orders");
        }
        
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData?.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format order ID as ORD-0001
  const formatOrderId = (id) => `ORD-${String(id).padStart(4, '0')}`;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format percentage change
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "N/A";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Get percentage color class
  const getPercentageColor = (value) => {
    if (value === null || value === undefined) return "text-muted-foreground";
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-muted-foreground";
  };
  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : dashboardStats?.revenue?.total ? formatCurrency(dashboardStats.revenue.total) : "N/A"}
            </div>
            <p className={`text-xs ${getPercentageColor(dashboardStats?.revenue?.month_over_month_change)}`}>
              {loading ? "..." : formatPercentage(dashboardStats?.revenue?.month_over_month_change)} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : dashboardStats?.products?.total !== undefined ? dashboardStats.products.total.toLocaleString() : "N/A"}
            </div>
            <p className={`text-xs ${getPercentageColor(dashboardStats?.products?.month_over_month_change)}`}>
              {loading ? "..." : formatPercentage(dashboardStats?.products?.month_over_month_change)} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : dashboardStats?.orders?.total !== undefined ? dashboardStats.orders.total.toLocaleString() : "N/A"}
            </div>
            <p className={`text-xs ${getPercentageColor(dashboardStats?.orders?.month_over_month_change)}`}>
              {loading ? "..." : formatPercentage(dashboardStats?.orders?.month_over_month_change)} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : dashboardStats?.customers?.total !== undefined ? dashboardStats.customers.total.toLocaleString() : "N/A"}
            </div>
            <p className={`text-xs ${getPercentageColor(dashboardStats?.customers?.month_over_month_change)}`}>
              {loading ? "..." : formatPercentage(dashboardStats?.customers?.month_over_month_change)} from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground ml-2">Chart placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {loading ? (
                <div className="text-center text-muted-foreground">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500">Error: {error}</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center text-muted-foreground">No recent orders found</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.order_id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {formatOrderId(order.order_id)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Customer: {order.customer_name || "N/A"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {formatCurrency(order.total_order_value)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);