from pydantic import BaseModel, Field

class UserModel(BaseModel):
    user_id: int = Field(..., title="User ID", description="Unique identifier for the user")
    username: str = Field(..., title="Username", description="Username of the user")
    email: str = Field(..., title="Email", description="Email address of the user")
    role_name: str = Field(..., title="Role Name", description="Role name of the user")
    image_url: str = Field(None, title="Image URL", description="URL of the user's profile image")
    warehouse_id: int = Field(None, title="Warehouse ID", description="Unique identifier for the warehouse")
    warehouse_name: str = Field(None, title="Warehouse Name", description="Name of the warehouse")
    warehouse_address: str = Field(None, title="Warehouse Address", description="Address of the warehouse")
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "username": "johndoe",
                "email": "user@example.com",
                "role_name": "admin",
                "image_url": "https://example.com/image.jpg",
                "warehouse_id": 1,
                "warehouse_name": "Main Warehouse",
                "warehouse_address": "123 Warehouse St, City, Country"
            }
        }
        
        
class UpdateUserModel(BaseModel):
    username: str = Field(None, title="Username", description="Username of the user")
    image_url: str = Field(None, title="Image URL", description="URL of the user's profile image")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "username": "johndoe",
                "image_url": "https://example.com/image.jpg",
            }
        }
    