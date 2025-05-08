import mysql.connector
from mysql.connector import errorcode
import os

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
        
    def __connect(self):
        try:
            self.connection = mysql.connector.connect(**self.config)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)
    
    def __close(self):
        if self.connection.is_connected():
            self.connection.close()
            
    def execute_query(self, query, params=None):
        cursor = self.connection.cursor()
        try:
            self.connection.start_transaction()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            result = cursor.fetchall()
            self.connection.commit()
            return result
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.connection.rollback()
            print("Transaction rolled back")
            
        finally:
            if cursor:
                cursor.close()
            self.__close()