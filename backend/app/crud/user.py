from datetime import datetime

from app.database import get_conn, lock

from app.auth import get_password_hash, oauth2_scheme, decode_access_token
from fastapi import Depends, HTTPException, status

def get_current_user(token = Depends(oauth2_scheme)):
    try:
        user = decode_access_token(token)
        if datetime.utcfromtimestamp(user.get("exp")) < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e :
        raise e
    return user

def get_user(user_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT id, name, surname, email, role FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_by_email(email: str):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None

def create_user(data: dict):
    conn = get_conn()
    with lock:
        cur = conn.execute(
            "INSERT INTO users (name, surname, email, hashed_password, role) VALUES (?, ?, ?, ?, ?)",
            (data.get("name"), data.get("surname"), data.get("email"), data.get("hashed_password"), data.get("role")),
        )
        conn.commit()
        new_id = cur.lastrowid
    conn.close()
    return get_user(new_id)

def update_user(user_id: int, payload: dict):
    fields = []
    params = []

    for key in ("name", "surname", "email", "role"):
        if key in payload:
            fields.append(f"{key} = ?")
            params.append(payload[key])

    if "password" in payload:
        fields.append("hashed_password = ?")
        params.append(get_password_hash(payload["password"]))

    if not fields:
        return get_user(user_id)

    params.append(user_id)
    sql = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"

    conn = get_conn()
    with lock:
        conn.execute(sql, params)
        conn.commit()
    conn.close()
    return get_user(user_id)

def delete_user(user_id: int):
    conn = get_conn()
    with lock:
        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
    conn.close()
    return True