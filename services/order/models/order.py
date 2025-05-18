from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class OrderResponse(BaseModel):
    status: str
    data: Dict[str, Any]
    message: str

class OrderItemData(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderData(BaseModel):
    customer_id: int
    items: List[OrderItemData]
    total_amount: float
    status: str = "pending"  # pending, processing, completed, cancelled
    notes: Optional[str] = None

class OrderItem(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float
    created_at: datetime
    updated_at: datetime

class Order(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem] 