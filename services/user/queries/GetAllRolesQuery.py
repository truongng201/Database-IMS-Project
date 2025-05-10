from shared_utils import Database

class GetAllRolesQuery:
    def __init__(self):
        self.db = Database()
    
    def execute(self):
        query = """
            SELECT role_id, role_name
            FROM roles
        """
        result = self.db.execute_query(query)
        self.db.close_pool()
        if not result:
            return []
        
        roles = []
        for row in result:
            role = {
                "role_id": row[0],
                "role_name": row[1]
            }
            roles.append(role)
        
        return roles

