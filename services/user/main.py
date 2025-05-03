import os

from fastapi import FastAPI
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

