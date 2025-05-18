import mysql.connector
from mysql.connector import pooling
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
            'pool_name': os.getenv('SERVICE_NAME', 'db_pool'),
            'pool_size': os.getenv('MYSQL_POOL_SIZE', 10),
        }
        self.pool = None
        self.__create_pool()

    def __create_pool(self):
        """
        Create a connection pool for the database.
        """
        try:
            self.pool = pooling.MySQLConnectionPool(
                **self.config
            )
            logger.info("Connection pool created successfully.")
        except mysql.connector.Error as err:
            logger.error(f"Error creating connection pool: {err}")
            raise Exception("Failed to create connection pool")

    def execute_query(self, query, params=None):
        """
        Execute a query using a connection from the pool.
        :param query: SQL query to execute.
        :param params: Parameters for the query (optional).
        :return: Query result.
        """
        connection = None
        cursor = None
        try:
            # Get a connection from the pool
            connection = self.pool.get_connection()
            cursor = connection.cursor()
            connection.start_transaction()

            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            result = cursor.fetchall()
            connection.commit()
            return result
        except mysql.connector.Error as err:
            logger.error(f"Query execution error: {err}")
            if connection:
                connection.rollback()
                logger.error("Transaction rolled back")
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()  # Return connection to the pool

    def close_pool(self):
        """
        Close all connections in the pool.
        """
        try:
            if self.pool:
                self.pool._remove_connections()
                logger.info("Connection pool closed successfully.")
        except Exception as e:
            logger.error(f"Error closing connection pool: {e}")
            raise Exception("Something went wrong")