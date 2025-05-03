from app.database import get_conn, lock

def init_db():
    conn = get_conn()
    with lock:
        #conn.execute("""DROP TABLE users""")
        conn.execute("""
                     CREATE TABLE IF NOT EXISTS users (
                         id          INTEGER PRIMARY KEY AUTOINCREMENT,
                         name        TEXT    NOT NULL,
                         surname     TEXT    NOT NULL,
                         email        TEXT    UNIQUE NOT NULL,
                         hashed_password TEXT NOT NULL,
                         role            TEXT    NOT NULL DEFAULT 'student' CHECK(role IN ('admin', 'student'))
                     )
                     """)
        #conn.execute("""INSERT INTO users (name, surname, email, hashed_password, role) VALUES ("Eugene", "Vasylevskyi", "avary007@gmail.com", "ce203fe4e015007c876dac6d881be501a5e96bc599a0b88e70e9dfa01ac17330", "admin");""")
        conn.commit()
    conn.close()


