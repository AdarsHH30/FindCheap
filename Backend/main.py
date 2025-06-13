from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api import search
import traceback


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/hello")
def read_hello():
    return {"message": "Hello from FastAPI!"}


@app.get("/search")
def search_endpoint(query: str):
    try:
        print(f"Received query: {query}")
        result = search(query=query)
        print(f"Search result: {result}")
        return result
    except Exception as e:
        print(f"Error in search: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
