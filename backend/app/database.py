import sqlite3
from threading import Lock

DB_PATH = "/data/app.db"
lock = Lock()

def get_conn():
    conn = sqlite3.connect(f"file:{DB_PATH}?mode=rwc", uri=True, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
