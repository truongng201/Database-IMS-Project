import os

from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from routes import router

ENV = os.getenv("ENV", "development")
SERVICE_NAME = os.getenv("SERVICE_NAME", "service")
APP_VERSION = os.getenv("APP_VERSION", "version") if ENV == "production" else ENV
API_VERSION = os.getenv("API_VERSION", "v1")

app = FastAPI(title=SERVICE_NAME, version=APP_VERSION, root_path=f"/{API_VERSION}/{SERVICE_NAME}")

# Register routes
app.include_router(router, tags=[f"{SERVICE_NAME}"])


@app.get(f"/health")
def health_check():
    return {"status": f"{SERVICE_NAME} service is running with version {APP_VERSION}"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # If the detail is already in our standard format, use it directly
    if isinstance(exc.detail, dict) and "status" in exc.detail:
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail
        )
    # Otherwise, wrap it in our standard format
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": str(exc.detail),
            "data": {}
        }
    )