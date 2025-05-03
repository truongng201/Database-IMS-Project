from fastapi import FastAPI
from routes.product_route import router as product_router

app = FastAPI(title="Product Service")

# Register routes
app.include_router(product_router, prefix="/products", tags=["products"])

@app.get("/products/health")
def health_check():
    return {"status": "Product Service is running!"}