import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import settings
from contextlib import contextmanager

class DatabaseConnection:
    def __init__(self):
        self.connection_string = settings.DATABASE_URL
    
    @contextmanager
    def get_connection(self):
        """
        Context manager for database connections
        """
        conn = None
        try:
            conn = psycopg2.connect(self.connection_string)
            yield conn
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()
    
    def get_cursor(self, conn):
        """
        Get a cursor that returns results as dictionaries
        """
        return conn.cursor(cursor_factory=RealDictCursor)

db_connection = DatabaseConnection()
