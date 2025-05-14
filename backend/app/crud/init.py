from app.database import get_conn, lock


def init_db():
    conn = get_conn()
    with lock:
        #conn.execute("""DROP TABLE users""")
        conn.execute("""
                     CREATE TABLE IF NOT EXISTS users (
                         id              INTEGER PRIMARY KEY AUTOINCREMENT,
                         name            TEXT    NOT NULL,
                         surname         TEXT    NOT NULL,
                         email           TEXT    UNIQUE NOT NULL,
                         hashed_password TEXT    NOT NULL,
                         role            TEXT    NOT NULL DEFAULT 'student' CHECK(role IN ('admin', 'student')),
                         g_id            TEXT    DEFAULT ""
                     )
                     """)
        conn.commit()
    conn.close()
