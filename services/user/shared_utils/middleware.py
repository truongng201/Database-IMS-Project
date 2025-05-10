from fastapi import Security
from fastapi.security.api_key import APIKeyHeader
from shared_config.custom_exception import UnauthorizedException
from .token import verify_token
from .logger import logger

# Instantiate APIKeyHeader
api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

def login_required(token: str = Security(api_key_header)):
    """
    Middleware to check if the user is logged in.
    """
    if not token:
        logger.error("No token provided")
        raise UnauthorizedException("You are not authenticated")
    
    try:
        user_data = verify_token(token)
        user_id = user_data.get("user_id")
        if not user_id:
            logger.error("User ID not found in token")
            raise UnauthorizedException("You are not authenticated")
        return user_id
    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        raise UnauthorizedException("You are not authenticated")
    