from pydantic import BaseModel
from typing import Optional, Dict, Any, List, Union
from datetime import datetime

class OrderResponse(BaseModel):
    status: str
    data: Union[Dict[str, Any], List[Dict[str, Any]]]
    message: str

class OrderItemData(BaseModel):
    product_id: int
    quantity: int
    price: float  # Unit price

class OrderData(BaseModel):
    customer_id: int
    items: List[OrderItemData]
    status: str = "pending"  # pending, completed, cancelled

class ProductOrderItem(BaseModel):
    order_item_id: int
    product_id: int
    quantity: int
    total_price: float

class OrderItem(BaseModel):
    order_item_id: int
    order_id: int
    created_time: datetime
    updated_time: datetime
    products: List[ProductOrderItem]

class Order(BaseModel):
    order_id: int
    customer_id: int
    status: str
    order_date: datetime
    created_time: datetime
    updated_time: datetime
    items: List[Dict[str, Any]] 