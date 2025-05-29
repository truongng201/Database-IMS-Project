from queries import DashboardStatsQuery
from shared_config.custom_exception import InvalidDataException, BadRequestException

class DashboardStatsController:
    def __init__(self):
        self.query = DashboardStatsQuery()
        
    def execute(self, user_info: dict):
        """
        Get comprehensive dashboard statistics based on user role
        """
        try:
            # Validate user info
            if not isinstance(user_info, dict):
                raise InvalidDataException("User info must be a dictionary")
                
            warehouse_id = user_info.get("warehouse_id")
            role_name = user_info.get("role_name")
            
            if not warehouse_id or not role_name:
                raise InvalidDataException("Warehouse ID and role name must be provided in user info")
                
            if role_name not in ("admin", "staff"):
                raise InvalidDataException("User role must be either 'admin' or 'staff'")
            
            # Determine warehouse filtering based on role
            warehouse_filter = None if role_name == "admin" else warehouse_id
            
            # Get all statistics
            revenue_stats = self.query.get_revenue_stats(warehouse_filter)
            products_stats = self.query.get_products_stats(warehouse_filter)
            orders_stats = self.query.get_orders_stats(warehouse_filter)
            customers_stats = self.query.get_customers_stats()  # Customers are not warehouse-specific
            self.query.close()
            return {
                "revenue": {
                    "total": revenue_stats['total_revenue'],
                    "current_month": revenue_stats['current_month_revenue'],
                    "previous_month": revenue_stats['previous_month_revenue'],
                    "month_over_month_change": revenue_stats['month_over_month_change']
                },
                "products": {
                    "total": products_stats['total_products'],
                    "current_month": products_stats['current_month_products'],
                    "previous_month": products_stats['previous_month_products'],
                    "month_over_month_change": products_stats['month_over_month_change']
                },
                "orders": {
                    "total": orders_stats['total_orders'],
                    "current_month": orders_stats['current_month_orders'],
                    "previous_month": orders_stats['previous_month_orders'],
                    "month_over_month_change": orders_stats['month_over_month_change']
                },
                "customers": {
                    "total": customers_stats['total_customers'],
                    "current_month": customers_stats['current_month_customers'],
                    "previous_month": customers_stats['previous_month_customers'],
                    "month_over_month_change": customers_stats['month_over_month_change']
                }
            }
            
        except Exception as e:
            raise e
        finally:
            self.query.close()
