from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()

origins = ["https://app.vasylevskyi.net", "https://vasylevskyi.net", "https://172.22.0.1"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/login")
def login_call():
    return {"token": "avary"}