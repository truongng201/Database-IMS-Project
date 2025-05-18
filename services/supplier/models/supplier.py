from pydantic import BaseModel
from typing import Optional, Dict, Any

class SupplierResponse(BaseModel):
    status: str
    data: Dict[str, Any]
    message: str

class SupplierData(BaseModel):
    name: str
    email: str
    phone: str
    address: str 