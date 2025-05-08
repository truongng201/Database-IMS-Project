from fastapi import HTTPException
from functools import wraps
from .response_model import StandardResponse
from typing import TypeVar, Callable
import inspect

T = TypeVar('T')

def standard_response(func: Callable[..., T]) -> Callable[..., StandardResponse[T]]:
    @wraps(func)
    async def async_wrapper(*args, **kwargs) -> StandardResponse[T]:
        try:
            result = func(*args, **kwargs)
            return StandardResponse[T](
                status="success",
                data=result,
                message="Operation completed successfully"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail={
                    "status": "error",
                    "message": str(e),
                    "data": {}
                }
            )
        
    @wraps(func)
    def sync_wrapper(*args, **kwargs) -> StandardResponse[T]:
        try:
            result = func(*args, **kwargs)
            return StandardResponse[T](
                status="success",
                data=result,
                message="Operation completed successfully"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail={
                    "status": "error",
                    "message": str(e),
                    "data": {}
                }
            )
            
    if inspect.iscoroutinefunction(func):
        return async_wrapper
    return sync_wrapper