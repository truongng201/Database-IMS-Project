import mysql.connector
from mysql.connector import errorcode
import os
from .logger import logger

class Database:
    def __init__(self):
        self.config = {
            'user': os.getenv('MYSQL_USER', 'root'),
            'password': os.getenv('MYSQL_PASSWORD', 'root'),
            'host': os.getenv('MYSQL_HOST', 'database'),
            'database': os.getenv('MYSQL_DATABASE', 'test_db'),
            'port': os.getenv('MYSQL_PORT', 3306),
            'raise_on_warnings': True,
        }
        self.connection = None
        self.__connect()
        if not self.connection:
            logger.error("Failed to connect to the database")
            raise Exception("Something went wrong")
        
    def __connect(self):
        try:
            if self.connection is None or not self.connection.is_connected():
                self.connection = mysql.connector.connect(**self.config)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                logger.error("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                logger.error("Database does not exist")
            else:
                logger.error(f"Connect to database got error: {err}")
    
    def execute_query(self, query, params=None):
        cursor = None
        try:
            # Ensure connection is alive
            self.__connect()
            
            cursor = self.connection.cursor()
            self.connection.start_transaction()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            result = cursor.fetchall()
            self.connection.commit()
            return result
        except mysql.connector.Error as err:
            logger.error(f"Query to database error: {err}")
            if self.connection:
                self.connection.rollback()
                logger.error(f"Transaction rolled back")
            self.connection = None
            raise 
        finally:
            if cursor:
                cursor.close()
                
    def close_connection(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            self.connection = None