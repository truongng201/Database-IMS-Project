from queries import RegisterQuery
from models import RegisterModel
from shared_config.custom_exception import InvalidDataException
import re
import bcrypt


class RegisterController:
    def __init__(self):
        self.query = RegisterQuery()
        
    def __hash_password(self, password: str) -> str:
        # Hash the password using bcrypt
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')   
        
    def execute(self, payload: RegisterModel):
        email = payload.email
        password = payload.password
        username = payload.username
        
        # Email must be valid type
        if not email or not password or not username:
            self.query.close()
            raise InvalidDataException("Invalid payload")

        if not isinstance(email, str) or not isinstance(password, str) or not isinstance(username, str):
            self.query.close()
            raise InvalidDataException("Invalid payload")

        # Must be a valid email
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            self.query.close()
            raise InvalidDataException("Invalid email")
        
        # Must be a valid password
        # Must be at least 8 characters long, contain at least one letter and one number
        # and not contain any spaces
        if not re.match(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", password):
            self.query.close()
            raise InvalidDataException("Invalid password")
        # Must be a valid username
        # Must be at least 3 characters long, contain only letters and numbers
        # and not contain any spaces
        if not re.match(r"^[A-Za-z0-9]{3,}$", username):
            self.query.close()
            raise InvalidDataException("Invalid username")
        
        res = self.query.check_email_exists(email)
        if res:
            self.query.close()
            raise InvalidDataException("Email already exists")
        # Hash the password
        hashed_password = self.__hash_password(password)
        payload.password = hashed_password
        # Create the user
        res = self.query.create_user(payload)
        self.query.close()
        if not res:
            raise Exception("Something went wrong")
        return True
        
        