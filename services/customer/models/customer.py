from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List, Union
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    customer_id: int
    created_time: datetime
    updated_time: datetime

    class Config:
        from_attributes = True

class CustomerResponse(BaseModel):
    status: str
    data: Union[Dict[str, Any], List[Dict[str, Any]]]
    message: str

class CustomerData(BaseModel):
    name: str
    email: str
    phone: str
    address: str 