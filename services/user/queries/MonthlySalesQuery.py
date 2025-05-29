from shared_utils import Database
from datetime import datetime, timedelta

class MonthlySalesQuery:
    def __init__(self):
        self.db = Database()
        
    def close(self):
        self.db.close_pool()
        
    def get_monthly_sales_data(self, warehouse_id=None):
        """Get monthly sales data for the last 6 months"""
        # Calculate date range for last 6 months
        now = datetime.now()
        current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Get start date 6 months ago
        months_back = 6
        start_date = current_month
        for _ in range(months_back - 1):
            start_date = (start_date - timedelta(days=1)).replace(day=1)
        
        if warehouse_id:
            # Staff - get sales data for specific warehouse
            query = """
            SELECT 
                DATE_FORMAT(o.order_date, '%Y-%m') as month,
                YEAR(o.order_date) as year,
                MONTH(o.order_date) as month_num,
                COALESCE(SUM(osv.total_order_value), 0) as total_sales,
                COUNT(DISTINCT o.order_id) as order_count
            FROM order_summary_view osv
            JOIN orders o ON osv.order_id = o.order_id
            WHERE o.order_date >= %s 
                AND o.status = 'completed'
                AND osv.warehouse_id = %s
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m'), YEAR(o.order_date), MONTH(o.order_date)
            ORDER BY year ASC, month_num ASC
            """
            params = (start_date, warehouse_id)
        else:
            # Admin - get sales data for all warehouses
            query = """
            SELECT 
                DATE_FORMAT(o.order_date, '%Y-%m') as month,
                YEAR(o.order_date) as year,
                MONTH(o.order_date) as month_num,
                COALESCE(SUM(osv.total_order_value), 0) as total_sales,
                COUNT(DISTINCT o.order_id) as order_count
            FROM order_summary_view osv
            JOIN orders o ON osv.order_id = o.order_id
            WHERE o.order_date >= %s 
                AND o.status = 'completed'
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m'), YEAR(o.order_date), MONTH(o.order_date)
            ORDER BY year ASC, month_num ASC
            """
            params = (start_date,)
            
        result = self.db.execute_query(query, params)
        
        # Create a complete list of months for the last 6 months
        monthly_data = []
        current_date = start_date
        
        # Create dictionary from database results for quick lookup
        db_results = {}
        if result:
            for row in result:
                month_key = row[0]  # 'YYYY-MM' format
                db_results[month_key] = {
                    'month': month_key,
                    'year': int(row[1]),
                    'month_num': int(row[2]),
                    'total_sales': float(row[3]) if row[3] else 0,
                    'order_count': int(row[4]) if row[4] else 0
                }
        
        # Generate data for all 6 months, filling gaps with zeros
        for i in range(months_back):
            month_key = current_date.strftime('%Y-%m')
            
            if month_key in db_results:
                monthly_data.append(db_results[month_key])
            else:
                # Fill with zero data for months with no sales
                monthly_data.append({
                    'month': month_key,
                    'year': current_date.year,
                    'month_num': current_date.month,
                    'total_sales': 0,
                    'order_count': 0
                })
            
            # Move to next month
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)
        
        return monthly_data
    
    def get_monthly_sales_summary(self, warehouse_id=None):
        """Get summary statistics for monthly sales"""
        monthly_data = self.get_monthly_sales_data(warehouse_id)
        
        if not monthly_data:
            return {
                'total_months': 0,
                'total_sales': 0,
                'average_monthly_sales': 0,
                'highest_month': None,
                'lowest_month': None,
                'monthly_data': []
            }
        
        total_sales = sum(month['total_sales'] for month in monthly_data)
        average_monthly_sales = total_sales / len(monthly_data) if monthly_data else 0
        
        # Find highest and lowest performing months (excluding zero sales months)
        non_zero_months = [month for month in monthly_data if month['total_sales'] > 0]
        
        highest_month = max(non_zero_months, key=lambda x: x['total_sales']) if non_zero_months else None
        lowest_month = min(non_zero_months, key=lambda x: x['total_sales']) if non_zero_months else None
        
        return {
            'total_months': len(monthly_data),
            'total_sales': total_sales,
            'average_monthly_sales': round(average_monthly_sales, 2),
            'highest_month': highest_month,
            'lowest_month': lowest_month,
            'monthly_data': monthly_data
        }
