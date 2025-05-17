import re
import bcrypt
import secrets
import string

from queries import LoginQuery
from models import LoginModel, TokensModel, LoginLogModel
from shared_config.custom_exception import InvalidDataException
from shared_utils import sign_token, logger

class LoginController:
    def __init__(self):
        self.query = LoginQuery()
        
    def __verify_password(self, password: str, hashed_password: str) -> bool:
        # Verify the password using bcrypt
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
        
    def execute(self, payload: LoginModel, client_ip: str, user_agent: str) -> TokensModel:
        email = payload.email
        password = payload.password
        if not email or not password:
            self.query.close()
            raise InvalidDataException("Email and password are required")
        
        if not isinstance(email, str) or not isinstance(password, str):
            self.query.close()
            raise InvalidDataException("Invalid email or password")
        # Must be a valid email
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            self.query.close()
            raise InvalidDataException("Invalid email or password")
        
        # Must be a valid password
        # Must be at least 8 characters long, contain at least one letter and one number
        # and not contain any spaces
        if not re.match(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", password):
            self.query.close()
            raise InvalidDataException("Invalid email or password")
        
        user = self.query.get_user_by_email(email)

        if not user:
            self.query.close()
            raise InvalidDataException("Invalid email or password")
        
        # Verify the password
        if not self.__verify_password(password, user.get("password_hash")):
            self.query.close()
            raise InvalidDataException("Invalid email or password")
        
        # Check if the user is active
        if not user.get("is_active"):
            self.query.close()
            raise InvalidDataException("User is not active")
        
        # Check if the user is staff but was not assigned to a warehouse
        if user.get("role_name") == "staff" and not user.get("warehouse_id"):
            self.query.close()
            raise InvalidDataException("User is not assigned to a warehouse")
        
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
            self.query.close()
            raise Exception("Something went wrong")
        self.query.close()
        
        # Generate JWT token
        jwt_payload ={
            "user_id": user.get("user_id"),
            "role_name": user.get("role_name"),
            "warehouse_id": user.get("warehouse_id"),
            "email": user.get("email"),
        }
        access_token = sign_token(jwt_payload)

        logger.info(f"Login successful for email: {payload.email}")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "user_id": user.get("user_id"),
                "role_name": user.get("role_name"),
                "warehouse_id": user.get("warehouse_id"),
                "email": user.get("email"),
            }
        }