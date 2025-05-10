from pydantic import BaseModel, Field

class UserModel(BaseModel):
    user_id: int = Field(..., title="User ID", description="Unique identifier for the user")
    username: str = Field(..., title="Username", description="Username of the user")
    email: str = Field(..., title="Email", description="Email address of the user")
    role_name: str = Field(..., title="Role Name", description="Role name of the user")
    full_name: str = Field(..., title="Full Name", description="Full name of the user")
    is_active: bool = Field(True, title="Is Active", description="Indicates if the user is active")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "username": "johndoe",
                "email": "user@example.com",
                "role_name": "admin",
                "full_name": "John Doe",
                "is_active": True
            }
        }


class RoleModel(BaseModel):
    role_id: int = Field(..., title="Role ID", description="Unique identifier for the role")
    role_name: str = Field(..., title="Role Name", description="Name of the role")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "role_id": 1,
                "role_name": "admin"
            }
        }
        
        
class UpdateUserModel(BaseModel):
    username: str = Field(..., title="Username", description="Username of the user")
    role_id: int = Field(..., title="Role ID", description="Unique identifier for the role")
    full_name: str = Field(..., title="Full Name", description="Full name of the user")
    is_active: bool = Field(True, title="Is Active", description="Indicates if the user is active")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "user_id": 1,
                "username": "johndoe",
                "email": "abc@example.com",
                "role_id": 1,
                "full_name": "John Doe",
                "is_active": True
            }
        }
    