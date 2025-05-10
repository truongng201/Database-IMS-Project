import re
import bcrypt
import secrets
import string

from queries import LoginQuery
from models import LoginModel, TokensModel, LoginLogModel
from shared_config.custom_exception import InvalidDataException
from shared_utils import sign_jwt, Cache, logger

EXPIRATION_TIME = 60 * 60 * 24 * 7  # 7 days

class LoginController:
    def __init__(self):
        self.query = LoginQuery()
        self.cache = Cache()
        
    def __verify_password(self, password: str, hashed_password: str) -> bool:
        # Verify the password using bcrypt
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
        
    def execute(self, payload: LoginModel, client_ip: str, user_agent: str) -> TokensModel:
        email = payload.email
        password = payload.password
        
        if not email or not password:
            raise InvalidDataException("Email and password are required")
        
        if not isinstance(email, str) or not isinstance(password, str):
            raise InvalidDataException("Invalid email or password")
        # Must be a valid email
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise InvalidDataException("Invalid email or password")
        
        # Must be a valid password
        # Must be at least 8 characters long, contain at least one letter and one number
        # and not contain any spaces
        if not re.match(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", password): # 
            raise InvalidDataException("Invalid email or password")
        logger.info(f"Login attempt for email: {email}")
        
        user = self.query.get_user_by_email(email)
        if not user:
            raise InvalidDataException("Invalid email or password")
        
        # Verify the password
        if not self.__verify_password(password, user.get("password_hash")):
            raise InvalidDataException("Invalid email or password")
        
        # If the password is correct
        # Generate JWT token
        # Generate refresh token
        # Return the tokens
        
        # Generate random string for refresh token
        alphabet = string.ascii_lowercase + string.digits
        refresh_token = ''.join(secrets.choice(alphabet) for _ in range(64))
        
        # Store the refresh token in the database
        loginlog = LoginLogModel(
            user_id=user.get("user_id"),
            refresh_token=refresh_token,
            ip_address=client_ip,
            user_agent=user_agent
        )
        res = self.query.create_login_log(loginlog)
        if not res:
            raise Exception("Something went wrong")
        
        # Generate JWT token
        jwt_payload ={
            "user_id": user.get("user_id"),
            "email": user.get("email"),
            "username": user.get("username"),
        }
        access_token = sign_jwt(jwt_payload, expires_in=EXPIRATION_TIME)
        
        # Store the access token in the cache
        self.cache.set(access_token, refresh_token)
        

        logger.info(f"Login successful for email: {payload.email}")
        
        return TokensModel(
            access_token=access_token,
            refresh_token=refresh_token
        )