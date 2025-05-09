from queries import GetAllCategoriesQuery
from models import CategoryModel
from shared_utils import logger

class GetAllCategoriesController:
    def __init__(self):
        self.query = GetAllCategoriesQuery()

    def execute(self) -> list[CategoryModel]:
        res = self.query.execute()
        if not res:
            return []
        return list[CategoryModel](
            CategoryModel(
                category_id=row.get("category_id"),
                name=row.get("name"),
                description=row.get("description")
            )
            for row in res
        )