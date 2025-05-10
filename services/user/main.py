import os

from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from routes import router
from shared_config.custom_exception import CustomException
from shared_config import standard_response, StandardResponse
from shared_utils import Database, Cache

ENV = os.getenv("ENV", "development")
SERVICE_NAME = os.getenv("SERVICE_NAME", "service")
APP_VERSION = os.getenv("APP_VERSION", "version") if ENV == "production" else ENV
API_VERSION = os.getenv("API_VERSION", "v1")

app = FastAPI(title=SERVICE_NAME, version=APP_VERSION, root_path=f"/{API_VERSION}/{SERVICE_NAME}")

# Register routes
app.include_router(router, tags=[f"{SERVICE_NAME}"])


@app.get(f"/health", response_model=StandardResponse)
@standard_response
def health_check():
    # Check database connection
    db = Database()
    db.execute_query("SELECT 1")
    db.close_pool()
    # Check cache connection
    Cache()

    return f"{SERVICE_NAME} service is running with version {APP_VERSION}"

@app.exception_handler(CustomException)
async def http_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": str(exc.message),
            "data": {}
        }
    )