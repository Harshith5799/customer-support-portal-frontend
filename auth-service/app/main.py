from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


users = {
    "admin": {
        "password": "admin123",
        "role": "ADMIN"
    },

    "customer": {
        "password": "customer123",
        "role": "CUSTOMER"
    }
}


@app.post("/login")
def login(request: LoginRequest):

    if (
        request.username in users
        and users[request.username]["password"] == request.password
    ):

        return {
            "success": True,
            "token": "sampletoken",
            "role": users[request.username]["role"]
        }

    return {
        "success": False,
        "message": "Invalid Username or Password"
    }


@app.get("/")
def home():
    return {
        "message": "Auth Service Running Successfully"
    }