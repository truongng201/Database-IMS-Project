from shared_utils import Database


class GetAllUsersQuery:
    def __init__(self):
        self.db = Database()

    def get_all_users(self):
        """
        Get all users from the database.
        """
        query = """
            SELECT
                user_id,
                username,
                email,
                role_name,
                is_active,
                users.created_time AS created_time,
                warehouses.warehouse_id AS warehouse_id,
                warehouses.name AS warehouse_name,
                warehouses.address AS warehouse_address,
                users.image_url AS image_url
            FROM users
            LEFT JOIN warehouses ON users.warehouse_id = warehouses.warehouse_id
            LIMIT 100
        """
        result = self.db.execute_query(query)
        if result is None:
            return []
        result = [
            {
                "user_id": row[0],
                "username": row[1],
                "email": row[2],
                "role_name": row[3],
                "is_active": row[4],
                "created_time": row[5],
                "warehouse_id": row[6],
                "warehouse_name": row[7],
                "warehouse_address": row[8],
                "image_url": row[9],
            }
            for row in result
        ]
        return result

    def close(self):
        """
        Close the database connection.
        """
        self.db.close_pool()