from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.crud.init import *
from app.crud.user import *
from app.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

import hashlib
from datetime import timedelta

from google.oauth2 import id_token
from google.auth.transport import requests

from app.crud.user import get_user_by_email

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https:\/\/(www\.)?app\.vasylevskyi\.net$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Hello from PHP@5.5.27"}


#----------------------------LOGIN------------------------------------

@app.post("/login")
def login_call(login_info: dict):
    email = login_info.get("email")
    password = login_info.get("password")
    user = get_user_by_email(email)

    if not user["hashed_password"]:
        raise HTTPException(401, "Account created via Google. Please sign in with Google.")

    if not user or hashlib.sha256(password.encode()).hexdigest() != user["hashed_password"]:
        raise HTTPException(401, "Invalid email or password")

    return {"token": get_token(user), "type": "bearer"}

@app.post("/google_login")
async def google_login_call(login_info: dict):
    try:
        idinfo = id_token.verify_oauth2_token(login_info["token"], requests.Request())
        user = get_user_by_email(idinfo["email"])

        if not user :
            # Maybe change to automatic signup with google
            raise HTTPException(401, "An account with this email address was not found. Please register before logging in.")

        if not user.get("g_id", ""):
            raise HTTPException(401, "This account was not created using Google. Please log in with your password to link it to Google Sign-In.")

        return {"token": get_token(user), "type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid token")



#-----------------------------------SIGNUP-------------------------------
@app.post("/signup")
def signup(user_data: dict):
    email = user_data.get("email", "")
    name    = user_data.get("name", "").strip()
    surname = user_data.get("surname", "").strip()
    password= user_data.get("password", "")

    if not (name and surname and email and password):
        raise HTTPException(
            status_code=422,
            detail="Name, surname, email and password are all required."
        )

    domain = email.split("@")[-1]
    with open("./app/email_origins.txt") as f:
        allowed = {line.strip() for line in f}

    if domain not in allowed:
        raise HTTPException(
            status_code=403,
            detail="Email domain not allowed. Contact support if this is an error."
        )

    if get_user_by_email(email):
        raise HTTPException(
            status_code=409,
            detail="Account already exists. Please log in or reset your password."
        )

    hashed = hashlib.sha256(password.encode()).hexdigest()
    payload = {
        "name":            name,
        "surname":         surname,
        "email":           email,
        "hashed_password": hashed,
        "role":            "student",
    }

    user = create_user(payload)

    return {"token": create_access_token(user)}


@app.post("/google_signup")
async def google_signup(user_data: dict):
    try:
        idinfo = id_token.verify_oauth2_token(user_data["token"], requests.Request())
    except ValueError:
        raise HTTPException(status_code=400, detail="Google Authentication failed. Please try again.")


    if not idinfo :
        raise HTTPException(401, "Google Authentication failed. Please try again.")

    user_payload = {
        "name": idinfo.get("given_name", ""),
        "surname": idinfo.get("family_name", ""),
        "email": idinfo["email"],
        "role": "student",
        "g_id": idinfo["sub"]
    }

    user = create_user(user_payload)

    token = create_access_token(
        data=user,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"token": token, "type": "bearer"}


#--------------------------------OTHER-----------------------------

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


# --------------------------------MICS------------------------------
def get_token(user: dict):
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

    return token
