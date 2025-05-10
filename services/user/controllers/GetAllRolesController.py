from queries import GetAllRolesQuery
from shared_config.custom_exception import NotFoundException

class GetAllRolesController:
    def __init__(self):
        self.query = GetAllRolesQuery()
        
    def execute(self):
        roles = self.query.execute()
        if not roles:
            raise NotFoundException("No roles found")
        return roles