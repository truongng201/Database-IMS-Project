from pydantic import BaseModel, Field

class ProductCreateModel(BaseModel):
    name: str = Field(..., title="Product Name", description="Name of the product")
    description: str = Field(None, title="Product Description", description="Description of the product")
    price: float = Field(..., title="Product Price", description="Price of the product")
    image_url: str = Field(None, title="Product Image URL", description="URL of the product image")
    category_id: int = Field(..., title="Category ID", description="ID of the category")
    supplier_id: int = Field(..., title="Supplier ID", description="ID of the supplier")
    location_id: int = Field(..., title="Location ID", description="ID of the location")
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "Sample Product",
                "description": "This is a sample product.",
                "price": 19.99,
                "image_url": "http://example.com/image.jpg",
                "category_id": 1,
                "supplier_id": 1,
                "location_id": 1
            }
        }
        
class ProductUpdateModel(BaseModel):
    product_id: int = Field(..., title="Product ID", description="Unique identifier for the product")
    name: str = Field(None, title="Product Name", description="Name of the product")
    description: str = Field(None, title="Product Description", description="Description of the product")
    price: float = Field(None, title="Product Price", description="Price of the product")
    image_url: str = Field(None, title="Product Image URL", description="URL of the product image")
    category_id: int = Field(None, title="Category ID", description="ID of the category")
    supplier_id: int = Field(None, title="Supplier ID", description="ID of the supplier")
    location_id: int = Field(None, title="Location ID", description="ID of the location")
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "product_id": 1,
                "name": "Updated Product",
                "description": "This is an updated product.",
                "price": 29.99,
                "image_url": "http://example.com/updated_image.jpg",
                "category_id": 1,
                "supplier_id": 1,
                "location_id": 1
            }
        }

class ProductModel(BaseModel):
    product_id: int = Field(..., title="Product ID", description="Unique identifier for the product")
    name: str = Field(..., title="Product Name", description="Name of the product")
    description: str = Field(None, title="Product Description", description="Description of the product")
    price: float = Field(..., title="Product Price", description="Price of the product")
    image_url: str = Field(None, title="Product Image URL", description="URL of the product image")
    category: dict = Field(..., title="Category", description="Category information")
    supplier: dict = Field(..., title="Supplier", description="Supplier information")
    warehouse: dict = Field(..., title="Warehouse", description="Warehouse information")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "product_id": 1,
                "name": "Sample Product",
                "description": "This is a sample product.",
                "price": 19.99,
                "image_url": "http://example.com/image.jpg",
                "category": {
                    "category_id": 1,
                    "name": "Electronics"
                },
                "supplier": {
                    "supplier_id": 1,
                    "name": "ABC Suppliers"
                },
                "warehouse": {
                    "warehouse_id": 1,
                    "name": "Warehouse A"
                }
            }
        }
        
class ProductListModel(BaseModel):
    products: list[ProductModel] = Field(..., title="List of Products", description="List of products")
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "products": [
                    {
                        "product_id": 1,
                        "name": "Sample Product",
                        "description": "This is a sample product.",
                        "price": 19.99,
                        "image_url": "http://example.com/image.jpg",
                        "category": {
                            "category_id": 1,
                            "name": "Electronics"
                        },
                        "supplier": {
                            "supplier_id": 1,
                            "name": "ABC Suppliers"
                        },
                        "warehouse": {
                            "warehouse_id": 1,
                            "name": "Warehouse A"
                        }
                    }
                ]
            }
        }