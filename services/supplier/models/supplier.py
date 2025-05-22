from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List, Union

class SupplierResponse(BaseModel):
    status: str
    data: Union[Dict[str, Any], List[Dict[str, Any]]]
    message: str

class SupplierData(BaseModel):
    name: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    email: Optional[str] = None
    phone: str
    address: Optional[str] = None
    
    @validator('contact_email', pre=True, always=True)
    def set_contact_email(cls, v, values):
        if v is None:
            return values.get('email')
        return v 