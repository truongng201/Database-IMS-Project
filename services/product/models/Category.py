from pydantic import BaseModel, Field

class CategoryModel(BaseModel):
    category_id: int = Field(..., title="Category ID", description="Unique identifier for the category")
    name: str = Field(..., title="Category Name", description="Name of the category")
    description: str = Field(None, title="Category Description", description="Description of the category")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "category_id": 1,
                "name": "Electronics",
                "description": "Devices and gadgets"
            }
        }
        
        
class CategoryCreateModel(BaseModel):
    name: str = Field(..., title="Category Name", description="Name of the category")
    description: str = Field(None, title="Category Description", description="Description of the category")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "Electronics",
                "description": "Devices and gadgets"
            }
        }
        
class CategoryUpdateModel(BaseModel):
    name: str = Field(None, title="Category Name", description="Name of the category")
    description: str = Field(None, title="Category Description", description="Description of the category")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "Updated Electronics",
                "description": "Updated devices and gadgets"
            }
        }
        
class CategoryResponseModel(BaseModel):
    category_id: int = Field(..., title="Category ID", description="Unique identifier for the category")
    name: str = Field(..., title="Category Name", description="Name of the category")
    description: str = Field(None, title="Category Description", description="Description of the category")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "category_id": 1,
                "name": "Electronics",
                "description": "Devices and gadgets"
            }
        }
        
class CategoryListResponseModel(BaseModel):
    categories: list[CategoryResponseModel] = Field(..., title="List of Categories", description="List of categories")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "categories": [
                    {
                        "category_id": 1,
                        "name": "Electronics",
                        "description": "Devices and gadgets"
                    },
                    {
                        "category_id": 2,
                        "name": "Furniture",
                        "description": "Home and office furniture"
                    }
                ]
            }
        }
        
    