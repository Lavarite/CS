from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.crud.init import *
from app.crud.user import *
from app.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

import hashlib
from datetime import timedelta

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Hello from PHP@5.5.27"}

@app.post("/login")
def login_call(login_info: dict):
    email = login_info.get("email")
    password = login_info.get("password")
    user = get_user_by_email(email)

    if not user or hashlib.sha256(password.encode()).hexdigest() != user["hashed_password"]:
        raise HTTPException(401, "Invalid email or password")

    user_payload = {
        "id": user["id"],
        "name": user["name"],
        "surname": user["surname"],
        "email": user["email"],
        "role": user["role"],
    }

    token = create_access_token(
        data=user_payload,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"token": token, "token_type": "bearer"}


@app.get("/users/me")
def read_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.get("/users/{user_id}")
def read_user(user_id: int, current_user: dict = Depends(get_current_user)):
    user = get_user(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user

@app.post("/users")
def post_user(user: dict, current_user: dict = Depends(get_current_user)):
    return create_user(user)

@app.put("/users/{user_id}")
def put_user(user_id: int, user: dict, current_user: dict = Depends(get_current_user)):
    if not get_user(user_id):
        raise HTTPException(404, "User not found")
    return update_user(user_id, user)

@app.delete("/users/{user_id}")
def delete_user(user_id: int, current_user: dict = Depends(get_current_user)):
    if not get_user(user_id):
        raise HTTPException(404, "User not found")
    delete_user(user_id)
    return {"ok": True}
