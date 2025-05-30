"use client";
import withAuth from "@/hooks/withAuth";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { BarChart as BarChartIcon, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useState, useEffect } from "react";

function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        // Fetch monthly sales data
        const salesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/monthly-sales`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${access_token}`,
            },
          }
        );
        
        if (!salesResponse.ok) {
          throw new Error("Failed to fetch monthly sales data");
        }
        
        const salesData = await salesResponse.json();
        setMonthlySales(salesData?.data || []);

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

  // Format month name
  const formatMonth = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  // Custom Bar Chart Component with sophisticated design
  const MonthlySalesChart = ({ salesData }) => {
    if (!salesData || !salesData.monthly_data || salesData.monthly_data.length === 0) {
      return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
          <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center me-3">
                <BarChartIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">No Data</h5>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">No sales data available</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const monthlyData = salesData.monthly_data;
    const totalSales = salesData.total_sales || 0;
    const avgSales = salesData.average_monthly_sales || 0;
    const highestMonth = salesData.highest_month;
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    
    // Calculate month-over-month change
    const monthChange = previousMonth && previousMonth.total_sales > 0 
      ? ((currentMonth.total_sales - previousMonth.total_sales) / previousMonth.total_sales * 100)
      : 0;

    const maxRevenue = Math.max(...monthlyData.map(item => item.total_sales));
    
    // Format month name
    const formatMonthName = (monthStr) => {
      const [year, month] = monthStr.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { month: 'short' });
    };

    return (
      <div className="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
        <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center me-3">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">
                {formatCurrency(currentMonth?.total_sales || 0)}
              </h5>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Current month revenue</p>
            </div>
          </div>
          <div>
            <span className={`text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md ${
              monthChange >= 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              <svg className={`w-2.5 h-2.5 me-1.5 ${monthChange < 0 ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
              </svg>
              {Math.abs(monthChange).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <dl className="flex items-center">
            <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Total sales:</dt>
            <dd className="text-gray-900 text-sm dark:text-white font-semibold">{formatCurrency(totalSales)}</dd>
          </dl>
          <dl className="flex items-center justify-end">
            <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal me-1">Avg monthly:</dt>
            <dd className="text-gray-900 text-sm dark:text-white font-semibold">{formatCurrency(avgSales)}</dd>
          </dl>
        </div>

        {/* Chart */}
        <div className="py-6">
          <div className="flex items-end space-x-3 h-48">
            {monthlyData.map((item, index) => {
              const height = maxRevenue > 0 ? (item.total_sales / maxRevenue) * 100 : 0;
              const minHeight = item.total_sales > 0 ? 5 : 2; // Minimum height for visibility
              const finalHeight = Math.max(height, minHeight);
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -translate-y-full mb-2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                    {formatCurrency(item.total_sales)}
                  </div>
                  
                  {/* Bar */}
                  <div className="w-full max-w-12 h-36 flex items-end mb-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer rounded-t-sm"
                      style={{ 
                        height: `${finalHeight}%`,
                        minHeight: item.total_sales > 0 ? '8px' : '2px'
                      }}
                    />
                  </div>
                  
                  {/* Month label */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {formatMonthName(item.month)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis reference lines */}
          <div className="relative mt-4 mb-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>$0</span>
              <span>{formatCurrency(maxRevenue * 0.25)}</span>
              <span>{formatCurrency(maxRevenue * 0.5)}</span>
              <span>{formatCurrency(maxRevenue * 0.75)}</span>
              <span>{formatCurrency(maxRevenue)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
          <div className="flex justify-between items-center pt-5">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last 6 months
            </div>
            <div className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-500">
              {highestMonth ? `Best: ${formatMonthName(highestMonth.month)} (${formatCurrency(highestMonth.total_sales)})` : 'No peak month'}
            </div>
          </div>
        </div>
      </div>
    );
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
            <MonthlySalesChart salesData={monthlySales} />
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