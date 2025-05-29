from queries import MonthlySalesQuery

class MonthlySalesController:
    def __init__(self):
        self.query = MonthlySalesQuery()
    
    def execute(self, user_info):
        """Get monthly sales data based on user role"""
        try:
            # Determine warehouse access based on user role
            warehouse_id = None
            if user_info.get('role') == 'staff':
                warehouse_id = user_info.get('warehouse_id')
            # Admin users (role='admin') can see all warehouses (warehouse_id=None)
            
            # Get monthly sales data
            monthly_sales_data = self.query.get_monthly_sales_summary(warehouse_id)
            self.query.close()
            if not monthly_sales_data:
                return {"message": "No sales data available for the specified period."}
            
            return monthly_sales_data
            
        except Exception as e:
            raise Exception(f"Error fetching monthly sales data: {str(e)}")
        finally:
            self.query.close()
