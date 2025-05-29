from shared_utils import Database
from datetime import datetime, timedelta

class DashboardStatsQuery:
    def __init__(self):
        self.db = Database()
        
    def close(self):
        self.db.close_pool()
        
    def get_revenue_stats(self, warehouse_id=None):
        """Get total revenue and month-over-month change"""
        # Get current month and previous month dates
        now = datetime.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        if warehouse_id:
            # Staff - get revenue for specific warehouse
            query = """
            SELECT
                -- Current month revenue
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= %s AND o.status = 'completed' 
                    THEN osv.total_order_value 
                    ELSE 0 
                END), 0) AS current_month_revenue,
                
                -- Previous month revenue
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= %s AND o.order_date < %s AND o.status = 'completed' 
                    THEN osv.total_order_value 
                    ELSE 0 
                END), 0) AS previous_month_revenue,
                
                -- Total revenue
                COALESCE(SUM(CASE 
                    WHEN o.status = 'completed' 
                    THEN osv.total_order_value 
                    ELSE 0 
                END), 0) AS total_revenue
            FROM order_summary_view osv
            JOIN orders o ON osv.order_id = o.order_id
            WHERE osv.warehouse_id = %s
            """
            params = (current_month_start, previous_month_start, current_month_start, warehouse_id)
        else:
            # Admin - get revenue for all warehouses
            query = """
            SELECT
                -- Current month revenue
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= %s AND o.status = 'completed' 
                    THEN osv.total_order_value 
                    ELSE 0 
                END), 0) AS current_month_revenue,
                
                -- Previous month revenue
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= %s AND o.order_date < %s AND o.status = 'completed' 
                    THEN osv.total_order_value 
                    ELSE 0 
                END), 0) AS previous_month_revenue,
                
                -- Total revenue
                COALESCE(SUM(CASE 
                    WHEN o.status = 'completed' 
                    THEN osv.total_order_value 
                    ELSE 0 
                END), 0) AS total_revenue
            FROM order_summary_view osv
            JOIN orders o ON osv.order_id = o.order_id
            """
            params = (current_month_start, previous_month_start, current_month_start)
            
        result = self.db.execute_query(query, params)
        if not result:
            return {
                'total_revenue': 0,
                'current_month_revenue': 0,
                'previous_month_revenue': 0,
                'month_over_month_change': 0
            }
            
        row = result[0]
        current_revenue = float(row[0]) if row[0] else 0
        previous_revenue = float(row[1]) if row[1] else 0
        total_revenue = float(row[2]) if row[2] else 0
        
        # Calculate percentage change
        if previous_revenue > 0:
            month_over_month_change = ((current_revenue - previous_revenue) / previous_revenue) * 100
        else:
            month_over_month_change = 100 if current_revenue > 0 else 0
            
        return {
            'total_revenue': total_revenue,
            'current_month_revenue': current_revenue,
            'previous_month_revenue': previous_revenue,
            'month_over_month_change': round(month_over_month_change, 2)
        }
    
    def get_products_stats(self, warehouse_id=None):
        """Get total products count and month-over-month change"""
        now = datetime.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        if warehouse_id:
            # Staff - get products for specific warehouse
            query = """
            SELECT
                -- Total products
                COUNT(*) AS total_products,
                
                -- Products created this month
                COALESCE(SUM(CASE 
                    WHEN created_time >= %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS current_month_products,
                
                -- Products created previous month
                COALESCE(SUM(CASE 
                    WHEN created_time >= %s AND created_time < %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS previous_month_products
            FROM products
            WHERE warehouse_id = %s
            """
            params = (current_month_start, previous_month_start, current_month_start, warehouse_id)
        else:
            # Admin - get products for all warehouses
            query = """
            SELECT
                -- Total products
                COUNT(*) AS total_products,
                
                -- Products created this month
                COALESCE(SUM(CASE 
                    WHEN created_time >= %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS current_month_products,
                
                -- Products created previous month
                COALESCE(SUM(CASE 
                    WHEN created_time >= %s AND created_time < %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS previous_month_products
            FROM products
            """
            params = (current_month_start, previous_month_start, current_month_start)
            
        result = self.db.execute_query(query, params)
        if not result:
            return {
                'total_products': 0,
                'current_month_products': 0,
                'previous_month_products': 0,
                'month_over_month_change': 0
            }
            
        row = result[0]
        total_products = int(row[0]) if row[0] else 0
        current_products = int(row[1]) if row[1] else 0
        previous_products = int(row[2]) if row[2] else 0
        
        # Calculate percentage change
        if previous_products > 0:
            month_over_month_change = ((current_products - previous_products) / previous_products) * 100
        else:
            month_over_month_change = 100 if current_products > 0 else 0
            
        return {
            'total_products': total_products,
            'current_month_products': current_products,
            'previous_month_products': previous_products,
            'month_over_month_change': round(month_over_month_change, 2)
        }
    
    def get_orders_stats(self, warehouse_id=None):
        """Get total orders count and month-over-month change"""
        now = datetime.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        if warehouse_id:
            # Staff - get orders for specific warehouse
            query = """
            SELECT
                -- Total orders
                COUNT(DISTINCT osv.order_id) AS total_orders,
                
                -- Orders created this month
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS current_month_orders,
                
                -- Orders created previous month
                COALESCE(SUM(CASE 
                    WHEN o.order_date >= %s AND o.order_date < %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS previous_month_orders
            FROM order_summary_view osv
            JOIN orders o ON osv.order_id = o.order_id
            WHERE osv.warehouse_id = %s
            """
            params = (current_month_start, previous_month_start, current_month_start, warehouse_id)
        else:
            # Admin - get orders for all warehouses
            query = """
            SELECT
                -- Total orders
                COUNT(*) AS total_orders,
                
                -- Orders created this month
                COALESCE(SUM(CASE 
                    WHEN order_date >= %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS current_month_orders,
                
                -- Orders created previous month
                COALESCE(SUM(CASE 
                    WHEN order_date >= %s AND order_date < %s 
                    THEN 1 
                    ELSE 0 
                END), 0) AS previous_month_orders
            FROM orders
            """
            params = (current_month_start, previous_month_start, current_month_start)
            
        result = self.db.execute_query(query, params)
        if not result:
            return {
                'total_orders': 0,
                'current_month_orders': 0,
                'previous_month_orders': 0,
                'month_over_month_change': 0
            }
            
        row = result[0]
        total_orders = int(row[0]) if row[0] else 0
        current_orders = int(row[1]) if row[1] else 0
        previous_orders = int(row[2]) if row[2] else 0
        
        # Calculate percentage change
        if previous_orders > 0:
            month_over_month_change = ((current_orders - previous_orders) / previous_orders) * 100
        else:
            month_over_month_change = 100 if current_orders > 0 else 0
            
        return {
            'total_orders': total_orders,
            'current_month_orders': current_orders,
            'previous_month_orders': previous_orders,
            'month_over_month_change': round(month_over_month_change, 2)
        }
    
    def get_customers_stats(self):
        """Get total customers count and month-over-month change"""
        now = datetime.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        # Customers are not warehouse-specific, so we get all customers for both admin and staff
        query = """
        SELECT
            -- Total customers
            COUNT(*) AS total_customers,
            
            -- Customers created this month
            COALESCE(SUM(CASE 
                WHEN created_time >= %s 
                THEN 1 
                ELSE 0 
            END), 0) AS current_month_customers,
            
            -- Customers created previous month
            COALESCE(SUM(CASE 
                WHEN created_time >= %s AND created_time < %s 
                THEN 1 
                ELSE 0 
            END), 0) AS previous_month_customers
        FROM customers
        """
        params = (current_month_start, previous_month_start, current_month_start)
        
        result = self.db.execute_query(query, params)
        if not result:
            return {
                'total_customers': 0,
                'current_month_customers': 0,
                'previous_month_customers': 0,
                'month_over_month_change': 0
            }
            
        row = result[0]
        total_customers = int(row[0]) if row[0] else 0
        current_customers = int(row[1]) if row[1] else 0
        previous_customers = int(row[2]) if row[2] else 0
        
        # Calculate percentage change
        if previous_customers > 0:
            month_over_month_change = ((current_customers - previous_customers) / previous_customers) * 100
        else:
            month_over_month_change = 100 if current_customers > 0 else 0
            
        return {
            'total_customers': total_customers,
            'current_month_customers': current_customers,
            'previous_month_customers': previous_customers,
            'month_over_month_change': round(month_over_month_change, 2)
        }
