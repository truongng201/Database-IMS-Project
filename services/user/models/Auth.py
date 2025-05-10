from pydantic import BaseModel, Field

class LoginModel(BaseModel):
    email: str = Field(..., title="Email", description="User's email address")
    password: str = Field(..., title="Password", description="User's password")
    
    class Config:
        orm_mode = False
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "string",
            }
        }
        
class RegisterModel(BaseModel):
    email: str = Field(..., title="Email", description="User's email address")
    password: str = Field(..., title="Password", description="User's password")
    username: str = Field(..., title="Username", description="User's username")
    full_name: str = Field(..., title="Full Name", description="User's full name")
    role_id: int = Field(..., title="Role ID", description="User's role ID")
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "string",
                "username": "johndoe",
                "full_name": "John Doe",
                "role_id": 1,
                "is_active": True
            }
        }
        
class LogoutModel(BaseModel):
    user_id: int = Field(..., title="User ID", description="Unique identifier for the user")
    refresh_token: str = Field(..., title="Refresh Token", description="Refresh token for the user session")
    
    class Config:
        orm_mode = False
        schema_extra = {
            "example": {
                "user_id": 1,
                "refresh_token": "string",
            }
        }
        
class TokensModel(BaseModel):
    access_token: str = Field(..., title="Access Token", description="JWT access token")
    refresh_token: str = Field(..., title="Refresh Token", description="Refresh token")
    
    class Config:
        orm_mode = False
        schema_extra = {
            "example": {
                "access_token": "string",
                "refresh_token": "string",
            }
        }
        
class LoginLogModel(BaseModel):
    user_id: int = Field(..., title="User ID", description="Unique identifier for the user")
    refresh_token: str = Field(..., title="Refresh Token", description="Refresh token for the user session")
    ip_address: str = Field(..., title="IP Address", description="IP address of the user")
    user_agent: str = Field(..., title="User Agent", description="User agent of the user's device")
    
    class Config:
        orm_mode = False
        schema_extra = {
            "example": {
                "user_id": 1,
                "refresh_token": "string",
                "ip_address": "192.168.1.1",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            }
        }