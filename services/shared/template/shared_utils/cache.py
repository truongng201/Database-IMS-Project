import redis
from .logger import logger
import os

class Cache:
    def __init__(self):
        self.client = redis.StrictRedis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=os.getenv('REDIS_PORT', 6379),
            db=int(os.getenv('REDIS_DB', 0)),
            password=os.getenv('REDIS_PASSWORD', None),
            decode_responses=True
        )
        self.__connect()

    def __connect(self):
        try:
            # Test the connection
            self.client.ping()
        except redis.ConnectionError as e:
            logger.error(f"Redis connection error: {e}")
            self.client = None
            raise Exception("Something went wrong")

    def get(self, key):
        """
        Get a value from the cache by key.
        :param key: The key to retrieve.
        :return: The value associated with the key, or None if not found.
        """
        try:
            if self.client:
                value = self.client.get(key)
                return value
        except Exception as e:
            logger.error(f"Error getting key '{key}': {e}")
            return None

    def set(self, key, value, ttl=-1):
        """
        Set a key in the cache with an optional TTL (time to live).
        :param key: The key to set.
        :param value: The value to set.
        :param
        :param ttl: Time to live in seconds. Default is -1 (no expiration).
        """
        try:
            if self.client:
                if ttl > 0:
                    self.client.set(key, value, ex=ttl)
                else:
                    self.client.set(key, value)
        except Exception as e:
            logger.error(f"Error setting key '{key}': {e}")
            raise Exception("Something went wrong")

    def delete(self, key):
        """
        Delete a key from the cache.
        :param key: The key to delete.
        """
        try:
            if self.client:
                self.client.delete(key)
        except Exception as e:
            logger.error(f"Error deleting key '{key}': {e}")
            raise Exception("Something went wrong")
        