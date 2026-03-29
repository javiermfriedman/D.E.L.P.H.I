import fastapi
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.server import add_new_word, send_featured_word, get_upcoming_words
from app.schemas import create_word_request

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/words")
def add_word(request: create_word_request):
    return add_new_word(request.word, request.definition, request.part_of_speech)

@app.get("/words")
def add_word():
    return get_upcoming_words()

# delete a word from upcoming

@app.post("/send")
def send_word():
    return send_featured_word()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

